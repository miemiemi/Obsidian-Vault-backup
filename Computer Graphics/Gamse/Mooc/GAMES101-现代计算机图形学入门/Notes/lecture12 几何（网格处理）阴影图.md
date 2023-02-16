
# Surfaces(Mesh)

- Mesh Subdivision (upsampling)
- Mesh Simplification (downsampling)
- Mesh Regularization (same \#triangles)
	- Modify sample distribution to improve quality

## Mesh Subdivision

- Loop Subdivision
	- Common subdivision rule for triangle meshes
		- First, create more triangles (vertices)
		- Second, tune their positions
	- [[GAMES101_Lecture_12#^kn37w3tfdom|Split each triangle into four]]
	- [[GAMES101_Lecture_12#^lg1bm2dv7b|Assign new vertex positions according to weights ]]
		- New / old vertices updated differently
	- [[GAMES101_Lecture_12#^akj9hn3ioih|Loop Subdivision — Update]]
		- [[GAMES101_Lecture_12#^hdvd6nwgla5|For new vertices:]]
		- [[GAMES101_Lecture_12#^kphomt891qa|For old vertices (e.g. degree 6 vertices here):]]
- Catmull-Clark Subdivision(General Mesh)
	- general mesh 一般网格
		- quad face, Non-quad face
		- Extraordinary vertex 
	- [[GAMES101_Lecture_12#^jis1qyluy9c|Each subdivision step: ]]
		- Add vertex in each face
		- Add midpoint on each edge
		- Connect all new vertices
	- [[GAMES101_Lecture_12#^411pmk35zf5|After one subdivision: ]]
		- New extraordinary vertices
		- non-quad faces to new extraordinary vertices
		- No more new extraordinary vertices after the first time subdivision
	- [[GAMES101_Lecture_12#^vcz99t7uqfe|FYI : Catmull-Clark Vertex Update Rules (Quad Mesh)]]
- [[GAMES101_Lecture_12#^8p5wrcndjrf|Convergence: Overall Shape and Creases]]

## Mesh Simplification

Goal : reduce number of mesh elements while maintaining the overall shape

- [[GAMES101_Lecture_12#^9iu8ddf4ua|Collapsing An Edge]]
	- 
