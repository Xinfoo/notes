---
title: Mateor Lake的数学速查表
description: Mateor Lake 整理的数学公式速查表，覆盖极限、导数、积分、微分方程、空间解析几何与多元微积分。
---

# Mateor Lake的数学速查表

本表由 Mateor Lake 整理。$\square$ 表示复合内层整体；标「必」的是高频必背结论。

## 一、极限：等价无穷小与泰勒

**重要极限**

$$
\lim_{\square\to0}\frac{\sin\square}{\square}=1,\qquad
\lim_{\square\to0}(1+\square)^{\frac{1}{\square}}=e,\qquad
\lim_{\square\to0}\frac{\ln(1+\square)}{\square}=1
$$

---

**等价（一阶）**

$$
\sin x\sim\tan x\sim\arcsin x\sim\arctan x\sim e^{x}-1\sim\ln(1+x)\sim x
$$

---

**等价（二阶）**

$$
1-\cos x\sim\frac{x^{2}}{2},\qquad
x-\ln(1+x)\sim\frac{x^{2}}{2},\qquad
(1+x)^{\alpha}-1\sim\alpha x
$$

---

**等价（三阶）**

$$
x-\sin x\sim\frac{x^{3}}{6},\qquad
\tan x-x\sim\frac{x^{3}}{3},\qquad
\arcsin x-x\sim\frac{x^{3}}{6}
$$

---

**1∞ 型**

$$
\lim u^{v}=\exp\left[\lim v(u-1)\right]\quad(u\to1,\ v\to\infty),\qquad
u^{v}=e^{v\ln u}
$$

---

**泰勒（必）**

$$
\sin x = x-\frac{x^{3}}{6}+o(x^{3}),\qquad
\cos x = 1-\frac{x^{2}}{2}+\frac{x^{4}}{24}+o(x^{4})
$$

$$
\tan x = x+\frac{x^{3}}{3}+o(x^{3}),\qquad
\ln(1+x) = x-\frac{x^{2}}{2}+\frac{x^{3}}{3}+o(x^{3})
$$

$$
e^{x} = 1+x+\frac{x^{2}}{2}+\frac{x^{3}}{6}+o(x^{3}),\qquad
(1+x)^{\alpha} = 1+\alpha x+\frac{\alpha(\alpha-1)}{2}x^{2}+o(x^{2})
$$

---

**常用不等式**

$$
\sin x<x<\tan x\ \left(0<x<\frac{\pi}{2}\right)
$$

$$
\ln(1+x)<x,\qquad
e^{x}\ge1+x,\qquad
\sqrt{ab}\le\frac{a+b}{2}\le\sqrt{\frac{a^{2}+b^{2}}{2}}
$$

## 二、导数与高阶导数

**基本表（必）**

$$
(x^{\alpha})'=\alpha x^{\alpha-1},\quad
(a^{x})'=a^{x}\ln a,\quad
(e^{x})'=e^{x}
$$

$$
(\log_a x)'=\frac{1}{x\ln a},\qquad
(\ln x)'=\frac{1}{x}
$$

$$
(\sin x)'=\cos x,\quad
(\cos x)'=-\sin x,\quad
(\tan x)'=\sec^{2}x,\quad
(\cot x)'=-\csc^{2}x
$$

$$
(\sec x)'=\sec x\tan x,\qquad
(\csc x)'=-\csc x\cot x
$$

$$
(\arcsin x)'=\frac{1}{\sqrt{1-x^{2}}},\qquad
(\arctan x)'=\frac{1}{1+x^{2}}
$$

---

**参数方程**

$$
\frac{dy}{dx}=\frac{y'(t)}{x'(t)},\qquad
\frac{d^{2}y}{dx^{2}}=\frac{1}{x'(t)}\frac{d}{dt}\left(\frac{y'(t)}{x'(t)}\right)
$$

---

**隐函数**

$$
F(x,y)=0:\ \frac{dy}{dx}=-\frac{F_x}{F_y};\qquad
F(x,y,z)=0:\ \frac{\partial z}{\partial x}=-\frac{F_x}{F_z}
$$

---

**变限积分**

$$
\frac{d}{dx}\int_{a}^{\varphi(x)}f(t)\,dt=f(\varphi(x))\varphi'(x)
$$

（上限是 $y-x$ 时别忘乘 $y'-1$。）

---

**$n$ 阶（必）**

$$
(e^{ax})^{(n)}=a^{n}e^{ax},\qquad
\left(\sin(ax+b)\right)^{(n)}=a^{n}\sin\left(ax+b+\frac{n\pi}{2}\right)
$$

$$
\left(\ln(1+x)\right)^{(n)}=\frac{(-1)^{n-1}(n-1)!}{(1+x)^{n}}
$$

---

**莱布尼茨**

$$
(uv)^{(n)}=\sum_{k=0}^{n}\binom{n}{k}u^{(k)}v^{(n-k)}
$$

（先找「导几次就归零」的因子，只留非零项。）

## 三、中值定理与泰勒公式

**罗尔**

$f\in C[a,b]$，在 $(a,b)$ 内可导，且 $f(a)=f(b)$，则存在 $\xi$ 使

$$
f'(\xi)=0
$$

---

**拉格朗日**

$$
f(b)-f(a)=f'(\xi)(b-a)
$$

---

**柯西**

$$
\frac{f(b)-f(a)}{g(b)-g(a)}=\frac{f'(\xi)}{g'(\xi)}\quad(g'\ne0)
$$

补充：$\dfrac{\ln b-\ln a}{b-a}=\dfrac{1}{\xi}$，就是 $\ln x$ 的两点差。

---

**积分中值**

$$
\int_{a}^{b}f(x)\,dx=f(\xi)(b-a),\quad\xi\in[a,b]
$$

---

**泰勒（拉氏余项）**

$$
f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^{k}+\frac{f^{(n+1)}(\xi)}{(n+1)!}(x-x_0)^{n+1}
$$

---

**泰勒（皮亚诺）**

$$
f(x)=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^{k}+o\left((x-x_0)^{n}\right)
$$

（求极限用它。）

---

**构造函数（必）**

要证 $f'+\varphi f=0$，取 $F=fe^{\int\varphi\,dx}$，则

$$
F'=e^{\int\varphi\,dx}\left(f'+\varphi f\right)
$$

常用构造：

$$
[x^{n}f]'=x^{n-1}\left[xf'+nf\right],\qquad
[fe^{nx}]'=e^{nx}\left[f'+nf\right]
$$

$$
[f\arctan x]'=f'\arctan x+\frac{f}{1+x^{2}}
$$

## 四、不定积分与定积分

**幂与指对（必）**

$$
\int x^{\alpha}\,dx=\frac{x^{\alpha+1}}{\alpha+1}+C\ (\alpha\ne-1),\qquad
\int\frac{dx}{x}=\ln|x|+C
$$

$$
\int e^{ax}\,dx=\frac{e^{ax}}{a}+C
$$

---

**三角（必）**

$$
\int\sin x\,dx=-\cos x+C,\qquad
\int\cos x\,dx=\sin x+C
$$

$$
\int\sec^{2}x\,dx=\tan x+C,\qquad
\int\tan x\,dx=-\ln|\cos x|+C
$$

$$
\int\cot x\,dx=\ln|\sin x|+C,\qquad
\int\sec x\,dx=\ln|\sec x+\tan x|+C
$$

---

**反三角（必）**

$$
\int\frac{dx}{1+x^{2}}=\arctan x+C,\qquad
\int\frac{dx}{\sqrt{1-x^{2}}}=\arcsin x+C
$$

$$
\int\frac{dx}{a^{2}+x^{2}}=\frac{1}{a}\arctan\frac{x}{a}+C
$$

---

**有理分式**

$$
\int\frac{dx}{x^{2}-a^{2}}=\frac{1}{2a}\ln\left|\frac{x-a}{x+a}\right|+C,\qquad
\int\frac{dx}{\sqrt{x^{2}\pm a^{2}}}=\ln\left|x+\sqrt{x^{2}\pm a^{2}}\right|+C
$$

---

**分部**

$$
\int u\,dv=uv-\int v\,du
$$

多项式 × 指数/三角用表格法（$+,-,+,-$ 交替）。

---

**对称性**

$$
\int_{-a}^{a}f(x)\,dx=
\begin{cases}
0, & f(-x)=-f(x),\\[4pt]
2\displaystyle\int_{0}^{a}f(x)\,dx, & f(-x)=f(x).
\end{cases}
$$

---

**华里士（点火）**

$$
\int_{0}^{\frac{\pi}{2}}\sin^{n}x\,dx=\int_{0}^{\frac{\pi}{2}}\cos^{n}x\,dx=
\begin{cases}
\dfrac{(n-1)!!}{n!!}, & n=2k+1,\\[6pt]
\dfrac{(n-1)!!}{n!!}\cdot\dfrac{\pi}{2}, & n=2k.
\end{cases}
$$

---

**伽马（必）**

$$
\Gamma(\alpha)=\int_{0}^{+\infty}x^{\alpha-1}e^{-x}\,dx
$$

$$
\Gamma(\alpha+1)=\alpha\Gamma(\alpha),\qquad
\Gamma(1)=1,\qquad
\Gamma\left(\frac{1}{2}\right)=\sqrt{\pi},\qquad
\Gamma(n+1)=n!
$$

---

**应用**

$$
S=\int_{a}^{b}|f(x)|\,dx,\qquad
L=\int_{a}^{b}\sqrt{1+f'^{2}(x)}\,dx
$$

$$
V_x=\pi\int_{a}^{b}f^{2}(x)\,dx,\qquad
V_y=2\pi\int_{a}^{b}x|f(x)|\,dx
$$

## 五、微分方程

**可分离**

$$
\frac{dy}{dx}=f(x)g(y)\ \Longrightarrow\ \int\frac{dy}{g(y)}=\int f(x)\,dx
$$

---

**齐次型**

$$
\frac{dy}{dx}=\varphi\left(\frac{y}{x}\right),\qquad
u=\frac{y}{x}\ \Rightarrow\ x\frac{du}{dx}=\varphi(u)-u
$$

---

**一阶线性（必）**

$$
y'+P(x)y=Q(x)\ \Longrightarrow\ y=e^{-\int P\,dx}\left[\int Qe^{\int P\,dx}\,dx+C\right]
$$

---

**二阶齐次（必）**

特征方程 $r^{2}+pr+q=0$：

$$
\begin{aligned}
\Delta>0&:\quad y=C_1e^{r_1x}+C_2e^{r_2x},\\
\Delta=0&:\quad y=(C_1+C_2x)e^{rx},\\
\Delta<0&:\quad y=e^{\alpha x}\left(C_1\cos\beta x+C_2\sin\beta x\right).
\end{aligned}
$$

---

**非齐次结构**

通解 $=$ 齐次通解 $+$ 一个特解。$f=e^{\lambda x}P_m(x)$ 时设

$$
y^{*}=x^{k}Q_m(x)e^{\lambda x}
$$

$k$ 的取法：$\lambda$ 不是特征根 $k=0$；是单根 $k=1$；是重根 $k=2$（都不等零次、一个等一次、两个等都二次）。

---

**欧拉方程**

$$
x^{2}y''+pxy'+qy=f(x),\qquad
x=e^{t}\ \Rightarrow\ \ddot{y}+(p-1)\dot{y}+qy=f(e^{t})
$$

## 六、空间解析几何

**点积 / 叉积（必）**

$$
\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta,\qquad
\vec{a}\perp\vec{b}\iff\vec{a}\cdot\vec{b}=0
$$

$$
\vec{a}\times\vec{b}=
\begin{vmatrix}
\vec{i} & \vec{j} & \vec{k}\\
a_x & a_y & a_z\\
b_x & b_y & b_z
\end{vmatrix}
$$

$|\vec{a}\times\vec{b}|$ 等于平行四边形面积。

---

**平面（必）**

$$
A(x-x_0)+B(y-y_0)+C(z-z_0)=0,\qquad
d=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^{2}+B^{2}+C^{2}}}
$$

---

**直线**

$$
\frac{x-x_0}{l}=\frac{y-y_0}{m}=\frac{z-z_0}{n}
$$

一般式取 $\vec{\tau}=\vec{n}_1\times\vec{n}_2$。

---

**夹角**

线线、面面用

$$
\cos\theta=\frac{|\vec{a}\cdot\vec{b}|}{|\vec{a}||\vec{b}|}
$$

线面用

$$
\sin\theta=\frac{|\vec{\tau}\cdot\vec{n}|}{|\vec{\tau}||\vec{n}|}
$$

---

**切线 / 切平面**

曲线取 $\vec{\tau}=(x',y',z')$；曲面 $F=0$ 取 $\vec{n}=(F_x,F_y,F_z)$，显式 $z=f(x,y)$ 取 $(f_x,f_y,-1)$。

---

**旋转曲面**

绕谁转谁不变；绕 $y$ 轴：

$$
x_0^{2}+z_0^{2}=x^{2}+z^{2},\qquad y_0=y
$$

消参即得。

## 七、多元微分

**全微分（必）**

$$
dz=f_x\,dx+f_y\,dy
$$

关系链：偏导连续 $\Rightarrow$ 可微 $\Rightarrow$ 连续，且可微 $\Rightarrow$ 偏导存在（反之不成立）。

---

**链式法则**

$$
\frac{\partial z}{\partial x}=
\frac{\partial z}{\partial u}\frac{\partial u}{\partial x}+
\frac{\partial z}{\partial v}\frac{\partial v}{\partial x}
$$

树状图几条路就几项相加。

---

**隐函数**

$$
\frac{\partial z}{\partial x}=-\frac{F_x}{F_z},\qquad
\frac{\partial z}{\partial y}=-\frac{F_y}{F_z}
$$

分母永远是被确定的那个变量。

---

**极值判别（必）**

$$
A=f_{xx},\quad B=f_{xy},\quad C=f_{yy}
$$

$AC-B^{2}>0$ 是极值（$A>0$ 极小、$A<0$ 极大）；$AC-B^{2}<0$ 非极值；$AC-B^{2}=0$ 失效。

---

**拉格朗日**

$$
L=f+\lambda g+\mu h
$$

令 $L_x=L_y=L_z=0$ 联立约束，代回比较大小。

## 八、多元积分：三大公式与雅可比

**极坐标（必）**

$$
\iint_{D}f\,dx\,dy=\int_{\alpha}^{\beta}d\theta\int_{r_1}^{r_2}f\,r\,dr
$$

别丢 $r$。

---

**柱 / 球（必）**

柱坐标：

$$
dV=\rho\,d\rho\,d\theta\,dz
$$

球坐标：

$$
dV=r^{2}\sin\varphi\,dr\,d\varphi\,d\theta
$$

---

**曲线积分**

$$
\int_{L}f\,ds=\int_{\alpha}^{\beta}f\sqrt{x'^{2}+y'^{2}}\,dt
$$

$$
\int_{L}P\,dx+Q\,dy=\int_{\alpha}^{\beta}\left(Px'+Qy'\right)dt
$$

---

**格林（必）**

$$
\oint_{L^{+}}P\,dx+Q\,dy=\iint_{D}\left(Q_x-P_y\right)dx\,dy
$$

$L$ 封闭、区域在左手边。

---

**路径无关**

单连通域内，$P_y=Q_x$、$\oint_{L}P\,dx+Q\,dy=0$、积分与路径无关，三者等价。

---

**曲面积分**

$$
\iint_{\Sigma}f\,dS=\iint_{D_{xy}}f\sqrt{1+z_x^{2}+z_y^{2}}\,dx\,dy
$$

$$
\begin{aligned}
&\iint_{\Sigma}P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy\\
&\quad=\iint_{\Sigma}\left(P\cos\alpha+Q\cos\beta+R\cos\gamma\right)dS
\end{aligned}
$$

---

**高斯（必）**

$$
\begin{aligned}
&\iint_{\Sigma^{+}}P\,dy\,dz+Q\,dz\,dx+R\,dx\,dy\\
&\quad=\iiint_{\Omega}\left(P_x+Q_y+R_z\right)dV
\end{aligned}
$$

封闭、外侧；不封闭先补面。

---

**斯托克斯**

$$
\begin{aligned}
&\oint_{\Gamma}P\,dx+Q\,dy+R\,dz\\
&\quad=\iint_{\Sigma}\left(P\cos\alpha+Q\cos\beta+R\cos\gamma\right)dS
\end{aligned}
$$

$\Gamma$ 与法向成右手系。

## 易错提醒

- 等价无穷小只能在乘除里换；加减要泰勒到同阶，否则主项被吃掉。
- 极坐标的 $r$、柱坐标的 $\rho$、球坐标的 $r^{2}\sin\varphi$，三个雅可比因子丢一个，整题错。
- 格林/高斯/斯托克斯先查两个前提：封闭与方向；有奇点先挖洞，不封闭先补面。
- 凡是「至少存在一点 $\xi$」的证明，最后一定要落到定理名字上（罗尔/拉格朗日/柯西/零点定理）。
