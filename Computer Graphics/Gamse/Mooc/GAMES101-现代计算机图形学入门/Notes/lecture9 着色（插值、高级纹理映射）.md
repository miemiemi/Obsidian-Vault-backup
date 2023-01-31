
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


# Texture antialiasing (MIPMAP)

- Simple Texture Mapping: Diffuse Color
	- For each rasterized screen sample $(x, y)$:
		$(u,v)$ = evaluate texture coordinate at $(x, y)$ texcolor = texture.sample(u,v) ;
		set sample's color(Usually the diffuse albedo Kd) to texcolor
- 简单应用后 纹理出现的问题
	- Texture Magnification(What if the texture is too **small**?)[[GAMES101_Lecture_09#^8h64634asv|- Easy Case]]
		- Generally don't want this — insufficient texture resolution A pixel on a texture — a texel (纹理元素、纹素)
		- [[GAMES101_Lecture_09#^y9wqg17ayc|Bilinear Interpolation]] (双线性插值)
			- [[GAMES101_Lecture_09#^b5ed0rd0w08|Linear interpolation]] 线性插值
			- Two helper lerps
			- [[GAMES101_Lecture_09#^wx3d6wlc0lp| Final result]]
			- Bilinear interpolation usually gives pretty good results at reasonable costs
	- Texture Magnification(What if the texture is too **large**?) - hard case
		- [[GAMES101_Lecture_09#^q2y9up16i4|Screen Pixel “Footprint” in Texture ]]
		- [[GAMES101_Lecture_09#^fxxl1mox90e|Will Supersampling Do Antialiasing?]]
			- Yes, high quality, but costly
			- When highly minified, many texels in pixel footprint
			- Signal frequency too large in a pixel
			- Need even **higher sampling frequency**
		- What if we don’t sample?
			- Just need to **get the average value within a range!**
			- [[GAMES101_Lecture_09#^g970qqqbjte|Point Query vs. (Avg.) Range Query]]
		- **Mipmap**
			- Allowing (fast, approx., square) range queries
			- “Mip” comes from the Latin “multum in parvo", meaning a multitude in a small space
			- 提前生成mipmap  (image pyramid)
			- What is the storage overhead of a mipmap? 多了 1/3
			- [[GAMES101_Lecture_09#^uzgij3yr9l8|Computing Mipmap Level D]]
			- [[GAMES101_Lecture_09#^v7q9cmqkhro|Trilinear Interpolation]] 两层之间也插值
			- [[GAMES101_Lecture_09#^vspaf6xsz1|Mipmap Limitations]]
		- Anisotropic Filtering 各向异性过滤
			- [[GAMES101_Lecture_09#^hbnhgpj61w|Ripmaps and summed area tables ]]
				- Can look up **axis-aligned rectangular** zones
				- Diagonal footprints still a problem
		- [[GAMES101_Lecture_09#^f1rfeqfk2yd|EWA filtering]]

# Applications of texture