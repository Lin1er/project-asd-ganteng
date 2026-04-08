all: app

app: main.cpp
	g++ -std=c++17 -O2 -o app main.cpp

win:
	x86_64-w64-mingw32-g++ -std=c++17 -O2 -o app.exe main.cpp

wasm:
	@EMCC_BIN=$(shell which emcc 2>/dev/null || echo /usr/lib/emscripten/emcc); \
	if ! [ -x "$$EMCC_BIN" ]; then \
	  echo '[WASM] Error: Emscripten (emcc) tidak ditemukan di PATH.'; exit 44; \
	fi; \
	$$EMCC_BIN -std=c++17 -O2 web/lab_wasm.cpp --bind -s MALLOC=emmalloc -s WASM=1 -o web/app.js

clean:
	rm -f app app.exe web/app.js web/app.wasm

.PHONY: all app win wasm clean
