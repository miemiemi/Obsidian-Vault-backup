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
