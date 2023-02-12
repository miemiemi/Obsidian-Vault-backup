
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
	- [[GAMES101_Lecture_11#^7g1zdqndyjb|Bézier Curve – Algebraic Formula]]
		- de Casteljau algorithm gives a pyramid of coefficients
		- [[GAMES101_Lecture_11#^w7qvbx71049|Example: quadratic Bézier curve from three points]]
		- [[GAMES101_Lecture_11#^037o3u823uu4|Bernstein form of a Bézier curve of order n]]
		- [[GAMES101_Lecture_11#^2zwhpnbg3gi|Bernstein Polynomials]]
	- [[GAMES101_Lecture_11#^hqdy5v5fbn|Properties of Bézier Curves]]
		- [[GAMES101_Lecture_11#^la6ew2eqaeo|Interpolates endpoints ]]
		- [[GAMES101_Lecture_11#^g0np1bvpck|Tangent to end segments ]]
		- Affine transformation property
			- Transform curve by transforming control points
		- **Convex hull** property
			- Curve is within convex hull of control points
	- Piecewise Bézier Curves
		- [[GAMES101_Lecture_11#^9vbgntjwm0h|Higher-Order Bézier Curves]]
			- Very hard to control!
			- Uncommon
		- [[GAMES101_Lecture_11#^sbsghcxlypb|Piecewise Bézier Curves]]
			- Instead, chain many low-order Bézier curve
			- Piecewise **cubic** Bézier the most common technique
			- [[GAMES101_Lecture_11#^3vxl4jyits|Piecewise Bézier Curve – Continuity]]
				- $C^0$ continuity 
				- $C^1$ continuity 
- [[GAMES101_Lecture_11#^1ikeg2prcou|Other types of splines]]
	- Spline
		- a continuous curve constructed so as to pass through a given set of points and have a certain number of continuous derivatives.
		- In short, a curve under control
	- [[GAMES101_Lecture_11#^x9bh01s47ab|B-splines]]
		- 