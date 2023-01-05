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
	- 旋转的逆矩阵 = 旋转的转置矩阵 (正交)
- Linear Transforms(线性变换)  = Matrices (of the same dimension)上述变换都能作为线性变换用矩阵表示
---
# Homogeneous coordinates

- Why homogeneous coordinates ?
	- 平移变换
	- Translation cannot be represented in matrix form(translation is NOT linear transform!)
	- But we don’t want that translation(平移变换) to be a special case
	- Is there a unified way to represent all transformations? (and what’s the cost?)
	

---

# Solution

-  Add a third coordinate (w-coordinate) 增加维度
	- 2D point 齐次加1
	- 2D vector 齐次加0
- Affine Transformations
- Inverse Transform
	- is the inverse of transform m in both a matrix and geometric sense
---


# Composing transforms

- Note that matrices are applied right to left obtain
- **Decomposing** Complex Transforms
	- rotate around a given point

