
# Blinn-Phong reflectance model

## Specular Term

- Intensity depends on view direction
	- Bright near mirror reflection direction
	- V close to mirror direction equals **half vector** near normal
	- Measure "near" by dot product of unit vectors
- $L_s = k_s (I / r^2) max(0 , \overrightarrow n\cdot \overrightarrow h )^p$
	- $h = bisector(v,l)$  解决反射方向不好算的问题
	- $p$ 指数 用于让高光变小 increasing p narrows the reflection lobe
	- 经验化模型公式
	- [[GAMES101_Lecture_08#^bhn8kx913vn|效果]]

## Ambient Term

- Shading that does not depend on anything
	- Add constant color to account for disregarded illuminiation and fill in black shadows
	- This is approximate / fake
	- $L_a = k_a I_a$

[[GAMES101_Lecture_08#^ddpttrfsfm|Blinn-Phong Reflection Model]]

---
# Shading Frequencies

[[GAMES101_Lecture_08#^hizxaqv5d6f|What caused the shading difference?]]

- Shade each triangle (flat shading)
	- Triangle face is flat -- one normal vector
	- Not good for smooth surface
- Shade each vertex (Gouraud shading) 
	- Interpolate colors from vertices across triangle
	- Each vertex has a normal vector
- Shade each pixel (Phong shading)
	- Interpolate normal vectors across each triangle
	- Compute full shading model at **each pixel**


- Defining Per-Vertex Normal Vectors
	- Best to get vertex normals from the underlying geometry
	- Otherwise have to infer vertex normals from triangle faces
		- Simple scheme : **average surrounding face normals**
- Defining Per-Pixel Normal Vectors
	- Barycentric interpolation (introducing soon) of vertex normals

---
# Graphics pipeline

- [[GAMES101_Lecture_08#^werj9dqpe5|Real-time Rendering Pipeline]]
- [[GAMES101_Lecture_08#^cf4pfycn39j|Shader Programs]]
	- Program vertex and fragment processing stages
	- Describe operation on a single vertex (or fragment)

---

# Texture Mapping

- Different Colors at Different Places?
- Surfaces are 2D
	- Surface lives in 3D world space, every 3D surface point also has a place where it goes in the 2D image (texture).
- [[GAMES101_Lecture_08#^fepv66rj3gh|Texture Applied to Surface]]
	- Each triangle “copies” a piece of the texture image to the surface.
- [[GAMES101_Lecture_08#^b9bpcrsmgdb|Visualization of Texture Coordinates]]
	- Each triangle vertex is assigned a **texture coordinate** (u,v)
- Textures can be used multiple times!
	- [[GAMES101_Lecture_08#^7kh5qxewpic|example textures]]  used / tiled