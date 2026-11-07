---
title: 针对 Cloudflare CDN 的 firewalld 配置方法
description: 使用 firewalld 的 ipset 与 rich rule，只允许 Cloudflare 节点访问源站 443/TCP，丢弃其他来源；不包含 IP 池自动更新。
updated: 2026-11-06
outline: [2, 3]
---

# 针对 Cloudflare CDN 的 firewalld 配置方法

当站点挂在 Cloudflare 后面时，源站的真实 IP 仍可能因为历史 DNS 记录、扫描或第三方泄露而暴露。攻击者拿到源站 IP 后，可以绕过 CDN 直接请求 443 端口。本文用 firewalld 的 ipset 与 rich rule 做一层白名单：只有 Cloudflare 官方网段能访问 443/TCP，其他来源的 443 请求直接丢弃。

::: warning 适用前提
- 源站的 443 端口只接受 Cloudflare 回源，不直接对普通用户提供服务。
- 域名在 Cloudflare 中开启了代理（橙色云朵）。如果使用“仅 DNS”模式，请求不会经过 Cloudflare，会被本文规则丢弃。
- 本文只处理 TCP/443。SSH、80 和其他业务端口不受影响，也不要在未理解规则含义的情况下直接套用到其他端口。
- 以下命令需要 root 权限，示例统一使用 `sudo`。
:::

## 实现思路

配置由两部分组成：

- **ipset**：保存 Cloudflare 官方公布的 IPv4 / IPv6 网段。
- **rich rule**：在 `public` zone 中按优先级处理 443/TCP。

两条规则的关键是 `priority`：

| 优先级 | 规则 | 作用 |
| --- | --- | --- |
| `-101` | 来源为 Cloudflare ipset 的 443/TCP | 先放行 Cloudflare 回源 |
| `-100` | 其余所有 443/TCP | 再丢弃非 Cloudflare 来源 |

firewalld 的 priority 范围是 `-32768` 到 `32767`，**数值越小越先执行**。因此 `-101` 在 `-100` 之前匹配，Cloudflare 的请求会先被 accept；剩下的 443 流量才会命中 drop。不要给这两条规则设置相同的优先级，同优先级规则的执行顺序是未定义的。

## 准备

确保启用了 firewalld：

```bash
sudo systemctl status firewalld.service
```

确保 firewalld 的 unit 为 enabled 且处于 active 状态，比如下方的样子：

```text
● firewalld.service - firewalld - dynamic firewall daemon
     Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; preset: disabled)
     Active: active (running) since Sat XXXX-XX-XX XX:XX:XX XXX; XXmin ago
 Invocation: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
       Docs: man:firewalld(1)
   Main PID: XXX (firewalld)
      Tasks: XXX (limit: XXX)
     Memory: XXM (peak: XXM)
        CPU: XXms
     CGroup: /system.slice/firewalld.service
             └─XXX /usr/bin/python /usr/bin/firewalld --nofork --nopid
```

示例里的 `preset: disabled` 只是发行版的预设值，不代表 unit 没有 enabled；关键看 `Loaded` 行的 `enabled` 和 `Active` 行的 `active (running)`。

如果显示为 disabled 状态，请启用它：

```bash
sudo systemctl enable --now firewalld
```

检查 firewalld 状态，并检查当前的默认域和作用域：

```bash
sudo firewall-cmd --state
sudo firewall-cmd --get-default-zone
sudo firewall-cmd --get-active-zones
```

本文以 `public` 为例。如果 `--get-default-zone` 输出的不是 `public`，请把后面命令中的 `--zone=public` 替换成实际 zone。还要确认承载公网流量的网卡确实在这个 zone 中，否则规则不会生效。

创建保存 IP 列表的目录：

```bash
sudo mkdir -p /root/ip_list
```

## 下载 Cloudflare IP 段

Cloudflare 官方提供两个纯文本列表：

- IPv4：<https://www.cloudflare.com/ips-v4>
- IPv6：<https://www.cloudflare.com/ips-v6>

```bash
sudo curl -fsSL https://www.cloudflare.com/ips-v4 -o /root/ip_list/cloudflare_ipv4.txt
sudo curl -fsSL https://www.cloudflare.com/ips-v6 -o /root/ip_list/cloudflare_ipv6.txt
```

检查文件是否正常：

```bash
wc -l /root/ip_list/cloudflare_ipv4.txt /root/ip_list/cloudflare_ipv6.txt
head -n 3 /root/ip_list/cloudflare_ipv4.txt
head -n 3 /root/ip_list/cloudflare_ipv6.txt
```

如果源站没有启用 IPv6，可以暂时跳过后面的 IPv6 ipset 和 IPv6 rich rule；但只要服务可能通过 IPv6 回源，就建议一并配置。

## 创建 ipset

IPv4 和 IPv6 分别创建：

```bash
sudo firewall-cmd --permanent --new-ipset=cloudflare_ipv4 --type=hash:net --option=family=inet
sudo firewall-cmd --permanent --new-ipset=cloudflare_ipv6 --type=hash:net --option=family=inet6
```

说明：

- `hash:net` 适合保存带掩码的网段，Cloudflare 列表里的内容正是 CIDR。
- `family=inet` 对应 IPv4，`family=inet6` 对应 IPv6。
- 如果同名 ipset 已经存在，`--new-ipset` 会报错。可以先运行 `sudo firewall-cmd --get-ipsets` 检查，不要重复创建。

## 导入 IP 网段

把下载好的列表导入对应的 ipset：

```bash
sudo firewall-cmd --permanent --ipset=cloudflare_ipv4 --add-entries-from-file=/root/ip_list/cloudflare_ipv4.txt
sudo firewall-cmd --permanent --ipset=cloudflare_ipv6 --add-entries-from-file=/root/ip_list/cloudflare_ipv6.txt
```

确认条目已经写入永久配置：

```bash
sudo firewall-cmd --permanent --ipset=cloudflare_ipv4 --get-entries | head -n 20
sudo firewall-cmd --permanent --ipset=cloudflare_ipv6 --get-entries | head -n 20
```

## 添加 rich rule

先添加 Cloudflare 的 accept 规则：

```bash
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv4" priority="-101" source ipset="cloudflare_ipv4" port port="443" protocol="tcp" accept'
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv6" priority="-101" source ipset="cloudflare_ipv6" port port="443" protocol="tcp" accept'
```

再添加其余 443 的 drop 规则：

```bash
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv4" priority="-100" port port="443" protocol="tcp" drop'
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family="ipv6" priority="-100" port port="443" protocol="tcp" drop'
```

几个容易混淆的点：

- 命令的添加顺序不影响最终匹配顺序，真正决定顺序的是 `priority`。
- `drop` 是静默丢弃，客户端通常看到连接超时；如果想立即拒绝，可以改成 `reject`，但 `drop` 更不容易暴露防火墙的存在。
- 如果 zone 里原本已经允许 `https` 服务，这两条负优先级的 rich rule 会先于普通规则执行，仍然能实现“只允许 Cloudflare”的效果。
- 不过仍建议移除已经放行的 443 端口：按实际放行方式二选一，如果 service 和 port 都存在就都移除：
  - `sudo firewall-cmd --permanent --zone=public --remove-service=https`
  - `sudo firewall-cmd --permanent --zone=public --remove-port=443/tcp`
- 如果已有其他 443 相关的 rich rule，先用 `--list-rich-rules` 检查，避免出现更早执行（数值更小）的放行规则。

## 应用配置

`--permanent` 只写入永久配置，不会立即生效。执行 reload：

```bash
sudo firewall-cmd --reload
```

然后检查运行时规则和 ipset：

```bash
sudo firewall-cmd --zone=public --list-rich-rules
sudo firewall-cmd --info-ipset=cloudflare_ipv4
sudo firewall-cmd --info-ipset=cloudflare_ipv6
sudo firewall-cmd --list-all --zone=public
```

`--info-ipset` 应该能看到 ipset 的类型、family 和条目数量。`--list-rich-rules` 在同时配置 IPv4/IPv6 时应显示新增的 4 条规则；如果跳过 IPv6，则应为 2 条。

## 验证效果

从 Cloudflare 代理的域名访问，应该正常：

```bash
curl -I https://example.com/
```

从一台**不属于 Cloudflare 网段的外部主机**直接访问源站 IP，应该超时或被拒绝：

```bash
curl -vk --connect-timeout 5 --resolve example.com:443:ORIGIN_IP https://example.com/
```

这里用 `--resolve` 把域名强制解析到源站 IP，同时保留 SNI 和 Host，适合验证“绕过 CDN 直连源站”的场景。不要在源站本机测试，因为本机流量不一定经过 `public` zone 的入站规则。

如果 Cloudflare 域名也打不开，先检查源站服务是否在监听：

```bash
sudo ss -lntp | grep ':443'
```

## 手动更新 IP 列表

Cloudflare 会调整自己的网段，本文只做一次性导入，不包含自动更新。直接重复执行 `--add-entries-from-file` 只会追加新条目，不会删除已经失效的旧网段。需要严格同步时，可以按下面的顺序手动更新：

```bash
# 1. 备份当前永久配置中的条目
sudo firewall-cmd --permanent --ipset=cloudflare_ipv4 --get-entries | sudo tee /root/ip_list/cloudflare_ipv4.old.txt >/dev/null

# 2. 下载新列表，覆盖旧文件
sudo curl -fsSL https://www.cloudflare.com/ips-v4 -o /root/ip_list/cloudflare_ipv4.txt

# 3. 删除旧条目，再导入新条目
sudo firewall-cmd --permanent --ipset=cloudflare_ipv4 --remove-entries-from-file=/root/ip_list/cloudflare_ipv4.old.txt
sudo firewall-cmd --permanent --ipset=cloudflare_ipv4 --add-entries-from-file=/root/ip_list/cloudflare_ipv4.txt

# IPv6 同理
sudo firewall-cmd --permanent --ipset=cloudflare_ipv6 --get-entries | sudo tee /root/ip_list/cloudflare_ipv6.old.txt >/dev/null
sudo curl -fsSL https://www.cloudflare.com/ips-v6 -o /root/ip_list/cloudflare_ipv6.txt
sudo firewall-cmd --permanent --ipset=cloudflare_ipv6 --remove-entries-from-file=/root/ip_list/cloudflare_ipv6.old.txt
sudo firewall-cmd --permanent --ipset=cloudflare_ipv6 --add-entries-from-file=/root/ip_list/cloudflare_ipv6.txt

# 4. 应用
sudo firewall-cmd --reload
```

删除和导入都是永久配置操作，执行 `--reload` 前不会影响当前运行时规则，因此不会出现“先删空、再导入”的中间断流窗口。

## 安全边界

上述规则只按来源 IP 过滤，能挡住大部分直接扫描源站 IP 的自动化攻击，但不能替代源站认证。Cloudflare 的回源 IP 由所有客户共享；如果还需要确认请求确实来自 Cloudflare，可以按需配置 [Authenticated Origin Pulls (mTLS)](https://developers.cloudflare.com/ssl/origin-configuration/authenticated-origin-pull/) 或使用 [Cloudflare Tunnel](https://developers.cloudflare.com/tunnel/)。

## 参考资料

- [Cloudflare IP Ranges](https://www.cloudflare.com/ips/)
- [firewalld.richlanguage(5)](https://firewalld.org/documentation/man-pages/firewalld.richlanguage.html)
- [firewall-cmd(1)](https://firewalld.org/documentation/man-pages/firewall-cmd.html)