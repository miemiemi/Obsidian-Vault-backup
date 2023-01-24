
# Shading

- Shading
	- Definition:
		- The process of applying a material to an object
	- [[GAMES101_Lecture_07#^q3nu8ancevq|A Simple Shading Model ]]
		- Perceptual Observations
			- Specular highlights 高光
			- Diffuse reflection 漫反射
			- Ambient lighting 环境光
	- Shading is Local
		- Compute light reflected toward camera at a specific **shading point**
		- Viewer direction, v
		- Surface normal, n
		-  Light direction, l
		-  Surface parameters
		- No shadows will be generated! (shading ≠ shadow) 
- **Diffuse Reflection**
	- Light is scattered uniformly in all directions
		- Surface color is the same for all viewing direction
	- [[GAMES101_Lecture_07#^jxds8h18ick|But how much light (energy) is received?]]
		- Lambert’s cosine law