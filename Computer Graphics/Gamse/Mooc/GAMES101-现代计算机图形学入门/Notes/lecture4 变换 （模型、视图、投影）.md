

# 3D Transforms

- Use homogeneous coordinates again:
- Use 4×4 matrices for affine transformations
	- Scale
	- Translation
	- [[GAMES101_Lecture_04#^1edrzo4o7ky|Rotation around x-, y-, or z-axis]]
- Compose any 3D rotation from Rx, Ry, Rz
	- 用简单的绕轴旋转描述复杂的旋转
	- So-called Euler angles
	- Often used in flight simulators: roll(滚筒翻), pitch(俯仰), yaw(横向摆动) 
	-  [[GAMES101_Lecture_04#^7zsc0y2j54|Rodrigues’ Rotation Formula]] (罗德里格斯旋转公式)
		- Rotation by angle α around axis n (旋转轴起点在原点)
		- How to prove this magic formula?
	- 四元数 Quaternion 插值


---

# Viewing (观测) transformation

- View (视图) / Camera transformation
	- What is view transformation ?
		- Think about how to take a photo
			- Find a good place and arrange people (**model** transformation)
			- Find a good “angle” to put the camera (**view** transformation)
			- Cheese! (**projection** transformation)

- Projection (投影) transformation 
- Orthographic (正交) projection 
- Perspective (透视) projection
