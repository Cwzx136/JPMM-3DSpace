'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { examples } from '@/lib/examples';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  Code2,
  Box,
  Sparkles,
  BookOpen,
  Zap,
} from 'lucide-react';

const THURSTON_BASE = "https://3-dimensional.space/examples/euc/torus/../..";

const IMPORT_MAP = `{
  "imports": {
    "three": "${THURSTON_BASE}/library/vendor/three/three.module.js",
    "three/addons": "${THURSTON_BASE}/library/vendor/three/addons/Addons.js",
    "three/addons/": "${THURSTON_BASE}/library/vendor/three/addons/",
    "stats": "${THURSTON_BASE}/library/vendor/stats.module.js",
    "dat.gui": "${THURSTON_BASE}/library/vendor/dat.gui.module.js",
    "3ds": "${THURSTON_BASE}/library/3ds/3dsEuc.js",
    "thurstonLite": "${THURSTON_BASE}/library/3ds/thurstonLite.js"
  }
}`;

function generateHTML(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="importmap">
${IMPORT_MAP}
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a1a; }
    canvas { display: block; }
    #loading-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #0a0a1a;
      z-index: 999;
      transition: opacity 0.5s ease;
    }
    #loading-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }
    .loader-spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(16, 185, 129, 0.2);
      border-top: 3px solid #10b981;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #loading-overlay p {
      margin-top: 16px;
      color: #71717a;
      font-size: 13px;
      font-family: system-ui, sans-serif;
    }
    #error-overlay {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 40%;
      overflow-y: auto;
      background: rgba(20, 0, 0, 0.92);
      color: #ff6b6b;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      padding: 16px 20px;
      border-top: 2px solid #ff4444;
      z-index: 1000;
      white-space: pre-wrap;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div id="loading-overlay">
    <div class="loader-spinner"></div>
    <p>Loading 3D scene...</p>
  </div>
  <div id="error-overlay"></div>
  <script>
    function hideLoader() {
      var loader = document.getElementById('loading-overlay');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(function() { loader.remove(); }, 600);
      }
    }
    window.addEventListener('load', function() {
      setTimeout(hideLoader, 500);
    });
    var observer = new MutationObserver(function() {
      if (document.querySelector('canvas')) {
        hideLoader();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  </script>
  <script>
    window.addEventListener('error', function(e) {
      hideLoader();
      var overlay = document.getElementById('error-overlay');
      overlay.style.display = 'block';
      overlay.textContent += e.message + '\\n  at ' + (e.filename || '') + ':' + (e.lineno || '') + '\\n\\n';
    });
    window.addEventListener('unhandledrejection', function(e) {
      hideLoader();
      var overlay = document.getElementById('error-overlay');
      overlay.style.display = 'block';
      overlay.textContent += 'Unhandled Promise: ' + (e.reason && e.reason.message || e.reason) + '\\n\\n';
    });
  </script>
  <script type="module">
${code}
  </script>
</body>
</html>`;
}

export default function Home() {
  const [code, setCode] = useState(examples[0].code);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setError(null);
    setHasRun(true);

    if (iframeRef.current) {
      const html = generateHTML(code);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;

      const onLoad = () => {
        URL.revokeObjectURL(url);
        iframeRef.current?.removeEventListener('load', onLoad);
        setIsRunning(false);
      };
      iframeRef.current.addEventListener('load', onLoad);
    }
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(examples[0].code);
    setError(null);
  }, []);

  const handleExampleChange = useCallback((exampleId: string) => {
    const example = examples.find((e) => e.id === exampleId);
    if (example) {
      setCode(example.code);
      setError(null);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!previewRef.current) return;

    if (!document.fullscreenElement) {
      previewRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fallback: do nothing if fullscreen request is denied
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // Sync fullscreen state with document
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Auto-run on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRun();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Listen for iframe errors
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'iframe-error') {
        setError(e.data.message);
        setIsRunning(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
      // Escape to exit fullscreen
      if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, isFullscreen]);

  const threejsExamples = examples.filter((e) => e.category === 'threejs');
  const thurstonExamples = examples.filter((e) => e.category === 'thurston');

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a] overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-13 flex items-center justify-between px-4 bg-[#0d0d20]/95 border-b border-zinc-800/60 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Box className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">
                3D Code Studio
              </h1>
              <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                Three.js & 3-dimensional.space
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-zinc-800 mx-1" />

          <Select onValueChange={handleExampleChange} defaultValue={examples[0].id}>
            <SelectTrigger className="w-60 h-8 text-xs bg-zinc-900/80 border-zinc-700/50 text-zinc-300 hover:border-zinc-600 focus:ring-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <SelectValue placeholder="Select example..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectGroup>
                <SelectLabel className="text-emerald-400 text-xs font-medium">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Three.js Examples
                </SelectLabel>
                {threejsExamples.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id} className="text-zinc-300 text-xs focus:bg-zinc-800 focus:text-zinc-100">
                    {ex.name}
                    <span className="text-zinc-600 ml-2">{ex.description}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-purple-400 text-xs font-medium">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Thurston Examples
                </SelectLabel>
                {thurstonExamples.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id} className="text-zinc-300 text-xs focus:bg-zinc-800 focus:text-zinc-100">
                    {ex.name}
                    <span className="text-zinc-600 ml-2">{ex.description}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] px-2 py-0 h-6 border-zinc-700 text-zinc-500 bg-zinc-900/50 font-mono">
            <Code2 className="w-3 h-3 mr-1" />
            Ctrl+Enter to run
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="h-8 px-4 text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 gap-1.5 font-medium transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </header>

      {/* Main Content — Resizable Split */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Code Editor Panel */}
        <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
          <div className="h-full flex flex-col bg-[#0d0d1a]">
            {/* Editor Tab Bar */}
            <div className="h-9 flex items-center justify-between px-3 bg-[#0f0f22] border-b border-zinc-800/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a2e] rounded-md border border-zinc-800/60">
                  <Code2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px] text-zinc-300 font-medium">main.js</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-zinc-600">
                <span className="text-[10px]">JavaScript</span>
                <span className="text-[10px] text-zinc-700 mx-1">|</span>
                <span className="text-[10px]">UTF-8</span>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-hidden">
              <CodeMirror
                value={code}
                height="100%"
                theme={oneDark}
                extensions={[javascript({ jsx: true })]}
                onChange={(value) => setCode(value)}
                className="h-full text-sm [&_.cm-editor]:h-full [&_.cm-scroller]:!font-mono [&_.cm-content]:py-2"
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightActiveLine: true,
                  foldGutter: true,
                  autocompletion: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  indentOnInput: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-[3px] bg-zinc-800/80 hover:bg-emerald-500/50 transition-colors cursor-col-resize active:bg-emerald-400" />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
          <div className="h-full flex flex-col bg-[#0a0a18]">
            {/* Preview Tab Bar */}
            <div className="h-9 flex items-center justify-between px-3 bg-[#0f0f22] border-b border-zinc-800/50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1a2e] rounded-md border border-zinc-800/60">
                  <Box className="w-3 h-3 text-teal-400" />
                  <span className="text-[11px] text-zinc-300 font-medium">3D Preview</span>
                </div>
                {isRunning && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400">Running</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                disabled={!hasRun}
                className="h-6 w-6 p-0 text-zinc-500 hover:text-white hover:bg-zinc-800 disabled:opacity-30"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </Button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 relative" ref={previewRef}>
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 bg-[#0a0a1a]"
                sandbox="allow-scripts allow-same-origin"
                title="3D Preview"
              />

              {/* Empty state — shown before first run */}
              {!hasRun && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a18] pointer-events-none">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto border border-emerald-500/10">
                      <Box className="w-8 h-8 text-emerald-400/60" />
                    </div>
                    <div>
                      <p className="text-zinc-500 text-sm font-medium">Click &quot;Run&quot; to preview the 3D scene</p>
                      <p className="text-zinc-600 text-xs mt-1">or press Ctrl+Enter</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error overlay */}
              {error && (
                <div className="absolute bottom-0 left-0 right-0 max-h-40 overflow-auto bg-red-950/90 border-t border-red-500/50 p-3">
                  <p className="text-red-300 text-xs font-mono whitespace-pre-wrap">{error}</p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <footer className="h-6 flex items-center justify-between px-3 bg-[#0a0a1a] border-t border-zinc-800/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-[10px] text-zinc-500">
              {error ? 'Error' : 'Ready'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-600">
            Three.js | 3-dimensional.space
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-600">
          <span>Imports: three, 3ds, thurstonLite</span>
        </div>
      </footer>
    </div>
  );
}
