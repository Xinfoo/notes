---
title: 不使用 oh-my-zsh 配置 zsh 插件
description: 在 Arch Linux 上用 pacman 安装 grml-zsh-config 与三个 zsh 插件，在 ~/.zshrc 中手动加载并绑定按键，不依赖 oh-my-zsh 或插件管理器。
updated: 2026-11-10
outline: [2, 3]
---

# 不使用 oh-my-zsh 配置 zsh 插件

oh-my-zsh 把主题、插件、别名和补全规则打包在一个框架里，装完就能用，但启动时要加载的东西很多。只想要自动建议、历史搜索和语法高亮这几项功能时，这套框架带来的启动开销和排查难度并不划算。

Arch Linux 官方仓库已经提供了这些插件的包，插件就是几个普通的 zsh 脚本，在 `~/.zshrc` 里 `source` 一下即可。本文使用 `grml-zsh-config` 提供基础配置，再加载三个独立插件，全程不安装 oh-my-zsh，也不引入 zinit、antigen 之类的插件管理器。

::: warning 适用前提
- 本文基于 Arch Linux 官方仓库的包，插件路径固定为 `/usr/share/zsh/plugins/<插件名>/`；其他发行版的包名和路径可能不同。
- `bind2maps` 是 `grml-zsh-config` 提供的函数，不是 zsh 内置命令。不安装它时，请改用「不使用 grml-zsh-config 时」一节的 `bindkey` 写法。
- 如果 `~/.zshrc` 里已经有 oh-my-zsh、zinit 等配置，先备份再移除，否则两套配置会同时修改键位和补全，出问题时很难判断是谁在起作用。
- 改坏 `~/.zshrc` 会让新终端无法正常使用。修改前保留一个已经打开的终端，或记住用 `zsh -f` 跳过配置文件启动，方便回滚。
:::

## 原理

这几个包安装时只把文件放进 `/usr/share/zsh/plugins/`，不会自动启用；`grml-zsh-config` 则是提供一个系统级的 `/etc/zsh/zshrc`。真正决定加载什么的是 `~/.zshrc`：

```text
/etc/zsh/zshrc（grml-zsh-config 提供：提示符、补全、bind2maps）
  ↓
~/.zshrc
  ├─ source zsh-autosuggestions.zsh          # 在光标后画历史建议
  ├─ source zsh-syntax-highlighting.zsh      # 先于 history-substring-search 加载
  ├─ source zsh-history-substring-search.zsh # 注册 Up/Down 搜索 widget
  └─ bind2maps ... Up/Down                   # 把按键指向上面的 widget
```

三个要点：

- zsh 会先读 `/etc/zsh/zshrc`，再读 `~/.zshrc`，所以后者可以直接使用 `bind2maps`，补全（`compinit`）也已经初始化完毕。
- `zsh-history-substring-search` 只负责注册 widget，不绑定按键。必须再用 `bindkey` 或 `bind2maps` 把 Up/Down 指过去，否则按 Up 还是原来的行为。
- 加载顺序有明确要求：`zsh-history-substring-search` 的官方 README 指定先加载 `zsh-syntax-highlighting`、再加载它自己，不要调换。`zsh-autosuggestions` 放在最前即可，它在每次 `precmd` 时重新包装 widget，对另外两者的先后不敏感。

## 安装

```bash
sudo pacman -S grml-zsh-config zsh-autosuggestions zsh-history-substring-search zsh-syntax-highlighting
```

| 包 | 作用 |
| --- | --- |
| `grml-zsh-config` | 提供系统级基础配置、补全和 `bind2maps` 等辅助函数，依赖 `zsh` |
| `zsh-autosuggestions` | 根据历史记录在光标后显示灰色建议 |
| `zsh-history-substring-search` | 按 Up/Down 在历史中做子串匹配 |
| `zsh-syntax-highlighting` | 命令、参数和路径的实时语法高亮 |

安装完成后确认入口文件都在：

```bash
ls /usr/share/zsh/plugins/*/*.zsh
```

## 配置 ~/.zshrc

在 `~/.zshrc` 末尾追加下面的内容。文件里如果已经有同类 `source`，先删掉旧的，避免重复加载：

```zsh
# 历史建议
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# 语法高亮
source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# 历史子串搜索
source /usr/share/zsh/plugins/zsh-history-substring-search/zsh-history-substring-search.zsh

# 把 Up/Down 绑定到子串搜索（grml-zsh-config 提供的函数）
bind2maps emacs viins vicmd -- Up   history-substring-search-up
bind2maps emacs viins vicmd -- Down history-substring-search-down
```

几点说明：

- 三个 `source` 的顺序按上游 README 排列：`zsh-syntax-highlighting` 在 `zsh-history-substring-search` 之前，不要调换。
- `bind2maps` 前面列出的是要修改的 keymap：`emacs` 是默认键位表，`viins`、`vicmd` 分别是 vi 模式的插入和普通模式。只绑 `emacs` 的话，切到 vi 模式后 Up/Down 仍是旧行为。
- 键位绑定必须放在 `source zsh-history-substring-search.zsh` 之后，因为 `history-substring-search-up` 这个 widget 由该插件注册。
- 两行 `bind2maps` 会覆盖 grml 默认的 `up-line-or-search` / `down-line-or-search`。不想改动默认行为时，删掉这两行即可，插件本身仍然加载，只是没有绑定按键。

### 不使用 grml-zsh-config 时

::: warning zsh 可能没有配置
如果不打算安装 grml-zsh-config 包并且没有安装其他提供配置的包和插件，正常情况下是没有 `/etc/zsh/zshrc` 这样的全局配置文件的，此时 zsh 会回退到程序默认行为，zsh 的默认行为功能非常有限，例如只有简陋的命令提示符，补全功能并未启用，而且默认行为并不会保存历史记录文件，这些功能可能需要在之后由您手动配置。
:::

没有安装 `grml-zsh-config` 时，`bind2maps` 不存在，需要直接调用 `bindkey`。Up/Down 的转义序列随终端变化，建议从 terminfo 读取，而不是手写序列：

```zsh
zmodload zsh/terminfo
bindkey "${terminfo[kcuu1]}" history-substring-search-up
bindkey "${terminfo[kcud1]}" history-substring-search-down
```

手写 `bindkey '^[[A' ...` 在部分终端下不会生效：终端在应用模式下发送的是 `^[OA`，而不是 `^[[A`。

## 应用配置

新开一个终端，或者直接重新执行 zsh：

```bash
exec zsh
```

建议用 `exec zsh`，不要用 `source ~/.zshrc`。`source` 会在当前 shell 里重复执行插件脚本，已经包装过的 widget 可能再包一层，表现为重复的建议或高亮异常；只有新进程才能得到干净的环境。

## 验证

逐项检查：

**启动无报错。** 新开终端应该直接出现提示符，没有 `command not found`、`source: no such file` 之类的内容。

**自动建议。** 输入一条曾经执行过的命令的前几个字符，光标后应该出现灰色补全；按 `→` 或 `End` 接受整段建议。默认的提示色由 `fg=8` 决定，可以检查：

```bash
echo $ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE
```

**历史子串搜索。** 输入命令中的任意片段（比如 `pac`），按 Up，应该匹配到历史里所有包含 `pac` 的命令，而不是只匹配以 `pac` 开头的命令。

**语法高亮。** 输入一个不存在的命令，命令名会显示为红色；正确的命令、参数和存在的路径则按正常颜色显示。

也可以在命令行直接查看按键绑定：

```bash
zmodload zsh/terminfo 2>/dev/null
bindkey -M emacs "${terminfo[kcuu1]}"
```

正常输出类似：

```text
"^[OA" history-substring-search-up
```

`^[OA` 是 xterm 应用模式下的 Up 序列，具体字节随终端不同；关键是右侧的 widget 名是 `history-substring-search-up`。如果显示的是 `up-line-or-search` 或 `up-line-or-history`，说明绑定没有生效，检查 `bind2maps` 是否在 `source` 之后、当前 shell 是否真的重新加载过配置。

## 注意事项

### 与 oh-my-zsh 的配置冲突

残留的 `source $ZSH/oh-my-zsh.sh`、`plugins=(...)`、`ZSH_THEME=...` 都要删掉。`~/.oh-my-zsh` 目录本身可以留着，只要不被加载就不会生效；两套配置同时存在时，主题和键位会互相覆盖，症状通常表现为「改了 `.zshrc` 却没有任何变化」。

### 加载顺序不要凭经验调整

`zsh-history-substring-search` 的官方 README 明确要求先加载 `zsh-syntax-highlighting`，再加载它自己。不要套用「语法高亮一般放在最后」的经验去调换这两行：顺序写反不一定立刻报错，但不符合上游说明，遇到历史搜索时高亮异常也很难排查。

### 不要反复 source ~/.zshrc

`zsh-autosuggestions` 会在每次 `precmd` 时重新包装 widget；重复执行 `source ~/.zshrc` 会让它反复注册，终端越用越慢，严重时出现错乱的建议。需要应用修改时，用 `exec zsh` 或新开终端。

### 键位与终端

`bind2maps` 按 terminfo 里的键名取序列，比手写转义序列可靠；但如果终端没有启用应用模式，Up 可能发送 `^[[A` 而不是 `^[OA`，此时改用 terminfo 的 `bindkey` 写法。vi 用户还要确认 `viins`、`vicmd` 两个 keymap 都已绑定，否则从插入模式切回普通模式后 Up/Down 会变回默认行为。

## 参考资料

- [Arch Wiki: Zsh](https://wiki.archlinux.org/title/Zsh)
- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
- [zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search)
- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)
- [grml-zsh-config](https://grml.org/zsh/)
- [zshzle(1)](https://zsh.sourceforge.io/Doc/Release/Zsh-Line-Editor.html)
