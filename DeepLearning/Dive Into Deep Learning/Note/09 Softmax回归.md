
# Softmax回归

- Decision boundary - heatmap
- 分类 vs 回归
	- 连续值
	- 预测一个离散类别
	- MNIST：手写数字识别（10类）
	- ImageNet：自然物体分类（1000类）
	- Kaggle上的分类问题
		- 人类蛋白质显微镜图片分类
		- 恶意软件分类
		- 恶意Wikipedia评论
	- 分类：
		- 通常多个输出
		- 输出$i$是预测为第$i$类的置信度
- 从回归到多类分类 - 均方损失
	- 对类别进行一位有效编码
		- one-hot encoding
	- 使用均方损失训练
	- 最大值为预测
	- 需要更置信的识别正确类
- 校验比例
	- 输出匹配概率(非负，和为1)
		- $y = softmax(o)$
	- 概率y和y head的区别作为损失
- Softmax和交叉熵损失
	- 交叉熵常用来衡量两个概率的区别
	- 将它作为损失
	- 其梯度是真实概率和预测概率的区别

# 损失函数

- L2 Loss 均方损失
- L1 Loss 绝对值损失
- Huber's Robust Loss

# 图像分类数据集

# 手动实现

# 框架实现

# QA

- Softlabel训练策略
	- Softmax很难逼近概率1
- softmax回归和logistics回归
	- 2项的softmax
	- 2分类问题，实际输出一个结果
- 交叉熵，相对熵，互信息  王木头
- 最大似然 李航
- 进程数 创建python进程
- 参数设置的方差
- accuracy 中为什么不把除以len(y) 做完
- new.eval()设置为评估模式
- 过拟合
- CNN 纹理
- 输出特征进行L2归一化
- 处理自己的数据集
- softmax的解释性，statistic learning
- 