

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

# Viewing (视图) transformation

- View (视图) / Camera transformation
	- What is view transformation ?
		- Think about how to take a photo
			- Find a good place and arrange people (**model** transformation) 把东西摆好
			- Find a good “angle” to put the camera (**view** transformation)
			- Cheese! (**projection** transformation) 投影成像
	- How to perform view transformation ?
		- [[GAMES101_Lecture_04#^t5l6z1vnt|Define the camera first]]
			- Position 
			- Look-at / gaze direction
			- Up direction (相机的旋转)
	- Key observation (把相机移动到标准位置上)
		- Always transform the camera to
			- The origin, up at Y, look at -Z
		- And transform the objects along with the camera
	- Transform the camera by $M_{view}$
		- $M_{view}$  [[GAMES101_Lecture_04#^tonv8eahvp|in math? ]]
	- Summary
		- Transform objects together with the camera
		- Until camera’s at the origin, up at Y, look at -Z
---

# Projection (投影) transformation 

[[GAMES101_Lecture_04#^p0sbkzesjmf|Perspective projection vs. orthographic projection]]

- Orthographic (正交) projection 
	- [[GAMES101_Lecture_04#^yldhimm9cnf|A simple way of understanding]]
		- Camera located at origin, looking at -Z, up at Y
		- Drop Z coordinate
		- Translate and **scale** the resulting rectangle to $[-1, 1]^2$
	- [[GAMES101_Lecture_04#^jfdkuzdhqm|In general]]
		- canonical cube
		- Slightly different orders (to the “simple way”)
			- Center cuboid by translating
			- Scale into “canonical” cube
	- [[GAMES101_Lecture_04#^32h461n1b4e|Transformation matrix?]]
	- Caveat
		- Looking at / along -Z is making near and far not intuitive (n > f)
		- FYI: that’s why OpenGL (a Graphics API) uses left hand coords.
- Perspective (透视) projection
	- Most common in Computer Graphics, art, visual system
	- Further objects are smaller
	- Parallel lines not parallel; converge to single point
	- 

