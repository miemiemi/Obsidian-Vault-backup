
# Explicit (显式几何)

Explicit Representations in Computer Graphics

- [[GAMES101_Lecture_11#^c81cvpe8h9s|Point Cloud (Explicit)]]
	- Easiest representation: list of points (x,y,z)
	- Easily represent any kind of geometry
	- Useful for LARGE datasets (>>1 point/pixel)
	- Often converted into polygon mesh
	- Difficult to draw in undersampled regions·
- [[GAMES101_Lecture_11#^uosnnyybswl|Polygon Mesh (Explicit)]]
	- Store vertices & polygons (often triangles or quads)
	- Easier to do processing / simulation, adaptive sampling
	- More complicated data structures
	- Perhaps most common representation in graphics
	- [[GAMES101_Lecture_11#^al997zmoyzi|The Wavefront Object File (.obj) Format]]
		- Just a text file that specifies vertices, normals, texture coordinates and their connectivities


# Curves

- Camera Paths
- Animation Curves
- Vector Fonts

- Bézier Curves
	- [[GAMES101_Lecture_11#^1cq4xinjavr|Defining Cubic Bézier Curve With Tangents]]
	- [[GAMES101_Lecture_11#^mpxkmwugcrh|Evaluating Bézier Curves – de Casteljau Algorithm]]
		- Consider three points (quadratic Bezier)  
		- [[GAMES101_Lecture_11#^w3xn5xqy0fh|Insert a point using linear interpolation]]
		- Insert on both edges
		- Repeat recursively
		- Run the same algorithm for every t in [0,1]
	- [[GAMES101_Lecture_11#^4j8jna1zcdj|Cubic Bézier Curve – de Casteljau]]
		- Four input points in total
		- Same recursive linear interpolations