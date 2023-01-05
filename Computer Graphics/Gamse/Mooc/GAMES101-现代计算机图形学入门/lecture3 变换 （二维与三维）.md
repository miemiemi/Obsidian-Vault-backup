Transformation

# Why Transformation?

- Modeling (模型移动)
	- translation
	- rotation
	- scaling
- Viewing
	- (3D to 2D) projection

---

# 2D transformations

- scale 
	- Scale Matrix
	- Reflection Matrix
- shear (切变)
	- Shear Matrix
- rotation (about the origin (0, 0), CCW by default)
	- Rotation Matrix
- Linear Transforms(线性变换)  = Matrices (of the same dimension)上述变换都能作为线性变换用矩阵表示
---
# Homogeneous coordinates

- Why homogeneous coordinates
	- 平移变换
	- Translation cannot be represented in matrix form(translation is NOT linear transform!)


Composing transforms