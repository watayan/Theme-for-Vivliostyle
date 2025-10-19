contents = section01.md section02.md section03.md section04.md section05.md
markdown = preface.md postface.md colophon.md toc.md
css      = css/common.css css/contents.css css/toc.css css/colophon.css

.PHONY: all preview clean

# all: all.pdf
all: contents.pdf

contents.pdf: $(contents) $(markdown) $(css) toc.md
	@echo "Generating contents.pdf..."
	npx vivliostyle build

toc.md: $(contents)
	@echo "Generating table of contents..."
	python3 toc.py

preview: $(contents) $(markdown) $(css) toc.md
	@echo "Preparing preview..."
	npx vivliostyle preview

clean: 
	@echo "Cleaning up..."
	rm -f contents.pdf toc.md

# all.pdf: contents.pdf
# 	@echo "Generating the complete pdf includeing covers..."
# 	pdftk cover1.pdf cover2.pdf contents.pdf cover3.pdf cover4.pdf output all.pdf


