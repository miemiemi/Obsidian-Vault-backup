
# Barycentric coordinates

- Interpolation Across Triangles
	- Why do we want to interpolate?
		- Specify values at vertices
		- Obtain smoothly varying values across triangles
	- What do we want to interpolate?
		- Texture coordinates, color, normal vectors....
	- How?
		- Barycentric coordinates
- Barycentric Coordinates
	-  $(\alpha,\beta,\gamma )$ [[GAMES101_Lecture_09#^1vxa2rpw2kl|A coordinate system for triangles]]
	-  $(x,y) =  \alpha A+ \beta B + \gamma C$
	- 用线性组合描述三角形内的点  在三角形内 Inside the triangle if all three coordinates are non-negative
	- $\alpha + \beta + \gamma = 1$ 保证点在三角形所在的平面内
	- [[GAMES101_Lecture_09#^8hdqgm8824c|Geometric viewpoint — proportional areas]]
	- [[GAMES101_Lecture_09#^8823zpfwu7e|What’s the barycentric coordinate of the centroid?]] 重心的重心坐标
	- [[GAMES101_Lecture_09#^pdt8a8n6lug|Barycentric Coordinates: Formulas]]
- Using Barycentric Coordinates
	- Linearly interpolate values at vertices
	- $V =  \alpha V_A+ \beta V_B + \gamma V_C$
	- $V_A, V_B, V_C$ can be positions, texture coordinates, color, normal, depth, material attribute
- However, barycentric coordinates are not invariant under projection!
	- 投影之后会改变
	- 三维空间中需要先计算重心插值后投影

---

# Texture queries

# Applications of texture
