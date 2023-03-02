
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