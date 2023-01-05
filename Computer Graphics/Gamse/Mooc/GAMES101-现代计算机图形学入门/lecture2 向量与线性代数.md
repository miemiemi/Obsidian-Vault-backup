 A Swift and Brutal Introduction to Linear Algebra!

# Graphics’ Dependencies

- Basic mathematics
	- Linear algebra, calculus, statistics
- Basic physics
	- Optics, Mechanics
- Misc
	- Signal processing
	- Numerical analysis
---

# Vectors

默认列向量

- Vector Normalization
- Vector Addition
- Vector Multiplication
	- Dot (scalar) product
		- Find **angle** between two vectors (e.g. cosine of angle between light source and surface)
		- Finding **projection** of one vector on another
		- Measure how close two directions are
		- Decompose a vector
		- Determine forward / backward (dot product > or < 0)
	- Cross (vector) Product 
		- 课程中默认右手系
		- Determine left / right
		- Determine inside / outside
	 - Orthonormal Bases and coordinate frames
		 - Often, many sets of coordinate systems
		 - Critical issue is transforming between these systems/ bases
---

# Matrices

In Graphics, pervasively used to represent transformations

- Matrix-Matrix Multiplication
	- Key for transforming points
- Transpose of a Matrix
- Identity Matrix and Inverses(逆矩阵)
- Vector multiplication in Matrix form
	- Dot product
	- **Cross product** dual matrix of vector