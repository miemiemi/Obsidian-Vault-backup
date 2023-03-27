

import pypdfium2 as pdfium

# Load a document
filepath = "test.pdf"
pdf = pdfium.PdfDocument(filepath)

# render a single page (in this case: the first one)
page = pdf[0]
pil_image = page.render(scale=2).to_pil()
pil_image.save("output.jpg")

# render multiple pages concurrently (in this case: all)
page_indices = [i for i in range(len(pdf))]
renderer = pdf.render(
    pdfium.PdfBitmap.to_pil,
    page_indices = page_indices,
)
for image, index in zip(renderer, page_indices):
    image.save("output_%02d.jpg" % index)
