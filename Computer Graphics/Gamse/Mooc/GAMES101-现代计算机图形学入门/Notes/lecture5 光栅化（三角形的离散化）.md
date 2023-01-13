- [[GAMES101_Lecture_05#^8ee6hjbq2ur|What’s near plane’s l, r, b, t then]]
	- If explicitly specified, good
	- Sometimes people prefer:  **vertical field-of-view (fovY)** and  **aspect ratio** (宽高比)
	- 有些水平的fov 可以通过 aspect ratio 和 fovY 推出
- [[GAMES101_Lecture_05#^21coa3muozt|How to convert from fovY and aspect to l, r, b, t? ]]
- ---


# Canonical Cube to Screen

- What is a screen?
	- An array of pixels
	- Size of the array: resolution
	- A typical kind of **raster** display
- Raster == screen in German
- Rasterize == **drawing onto the screen**
- Pixel (FYI, short for “picture element”)
	- For now: A pixel is a little square with uniform color
	- Color is a mixture of (red, green, blue)
- [[GAMES101_Lecture_05#^fh2ik3qcjf|Defining the screen space]]
- Irrelevant to z
- Transform in xy plane: $[-1, 1]^2$ to [0, width] x [0, height]
- [[GAMES101_Lecture_05#^9ezcyq6htde|Viewport transform matrix]]

---

# Rasterizing Triangles into Pixels

Frame Buffer: Memory for a Raster Display

Polygon Meshes  
Triangle Meshes
- Triangles - Fundamental Shape Primitives
	- Why triangles?
		- Most basic polygon
		- Break up other polygons
	- Unique properites
		- Guaranteed to be planar
		- Well-defined interior (容易判别是否在内部)
		- Well-defined method for interpolating values at vertices over triangle (barycentric interpolation)
- Sampling (采样)
	- [[GAMES101_Lecture_05#^3z2mtjehrie|Sampling a Function]]
	- Evaluating a function at a point is sampling.  We can discretize a function by sampling.
	- Sampling is a **core idea** in graphics.  We sample time (1D), area (2D), direction (2D), volume (3D) ..
- Rasterization As 2D Sampling
	- Sample If Each Pixel Center Is **Inside** Triangle
	- [[GAMES101_Lecture_05#^a5w4y380amk|Define Binary Function:]]
	- [[GAMES101_Lecture_05#^owgkf45otgd|Evaluating inside(tri, x, y)]]
	- [[GAMES101_Lecture_05#^mx2mym3kyta|Edge Cases (Literally)]]
	- [[GAMES101_Lecture_05#^e3evldtmfb4|Checking All Pixels on the Screen?]] (不看全部的像素 只看区域内的Bounding Box 轴向包围盒 axis-aligned bounding box )
	- [[GAMES101_Lecture_05#^v0t5oynccy|Incremental Triangle Traversal (Faster?)]]
---

# Rasterization on  Real Displays  

- [[GAMES101_Lecture_05#^1lzr80vahoi|Real LCD Screen Pixels (Closeup)]]
- [[GAMES101_Lecture_05#^8l6y9pmhmdo|Color print: observe half-tone pattern]]
- [[GAMES101_Lecture_05#^dhqtwrljx1f|Assume Display Pixels Emit Square of Light]]
- [[GAMES101_Lecture_05#^f40974qxw1a|Aliasing (Jaggies)]]