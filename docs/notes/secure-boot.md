---
title: 为 Arch Linux 配置安全启动
description: 使用 shim 与 systemd-boot 为 Arch Linux 配置 UEFI 安全启动，包括创建、导入、签名和检查 MOK 证书。
updated: 2026-10-25
outline: [2, 3]
---

# 为 Arch Linux 配置安全启动

我们要为 Arch Linux 配置安全启动，使用 systemd-boot 作为引导管理器。

## 安装工具

```bash
sudo pacman -S sbsigntools mokutil
```

## 创建一个保存证书的目录(请妥善保管该目录)，并安装由 Fedora 签名的 shim

```bash
mkdir Secure_Boot
```

```bash
cd Secure_Boot
```

```bash
git clone https://aur.archlinux.org/shim-signed.git
```

```bash
cd shim-signed
```

```bash
makepkg -sir
```

## 替换引导管理器

```bash
cp "/usr/share/shim-signed/shimx64.efi" "/boot/EFI/BOOT/BOOTX64.EFI"
```

```bash
cp "/usr/share/shim-signed/mmx64.efi" "/boot/EFI/BOOT/MMX64.EFI"
```

## 生成自己的证书

```bash
openssl req \
    -new \
    -x509 \
    -newkey rsa:4096 \
    -keyout MOK.key \
    -out MOK.crt \
    -nodes \
    -days 3650 \
    -subj "/CN=Custom/"
```

此处的 Custom 可被替换为任意内容。

## 转换证书

```bash
openssl x509 \
    -outform DER \
    -in MOK.crt \
    -out MOK.cer
```

## 导入证书并设置临时密码

```bash
sudo mokutil --import MOK.cer
```

重启电脑并输入刚才的临时密码

```bash
reboot
```

## 签名 systemd-boot 和 Linux 内核镜像

```bash
sbsign \
    --key MOK.key \
    --cert MOK.crt \
    --output systemd-bootx64.efi \
    /boot/EFI/systemd/systemd-bootx64.efi
```

```bash
sbsign \
    --key MOK.key \
    --cert MOK.crt \
    --output vmlinuz-linux-zen \
    /boot/vmlinuz-linux-zen
```

如果是其他内核请替换 vmlinuz-linux-zen。

## 复制 systemd-boot 和 Linux 内核镜像

```bash
sudo cp systemd-bootx64.efi /boot/EFI/BOOT/GRUBX64.EFI
```

```bash
sudo cp vmlinuz-linux-zen /boot/vmlinuz-linux-zen
```

## 检查命令

**检查证书是否导入**

```bash
sbverify --list XX.der
```

**检查启动状态**

```bash
bootctl status
```

**检查证书**

```bash
sudo mokutil --list-enrolled
```

## 清除处于 BIOS 的 NVRAM 中的 MOK 证书

设置临时修改密码

```bash
sudo mokutil --reset
```

重启电脑

```bash
reboot
```

之后在 shim 的界面输入密码，移除所有密钥。
