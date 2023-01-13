
# Antialiasing

- Sampling is Ubiquitous in  Computer Graphics
	- Rasterization = Sample 2D Positions  
	- Photograph = Sample Image Sensor Plane
	- Video = Sample Time
- Sampling **Artifacts**  (Errors / Mistakes / Inaccuracies) in  Computer Graphics
	- Jaggies (Staircase Pattern)
	- Moiré Patterns in Imaging
	- Wagon Wheel Illusion (False Motion)
- Behind the Aliasing Artifacts
	- Signals are changing too fast (high frequency),  but sampled too slowly
- Antialiasing Idea:  Blurring (Pre-Filtering) Before Sampling
	- [[GAMES101_Lecture_06#^9ezn878tabi|Rasterization: Antialiased Sampling]]
	- [[GAMES101_Lecture_06#^x90xfjbahdl|Sample then filter, WRONG!]]
- **Frequency Domain**
	- Fourier Transform
		- Represent a function as a  weighted sum of sines and  cosines

---

# Visibility / occlusion