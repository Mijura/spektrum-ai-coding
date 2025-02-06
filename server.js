"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSourceCode = void 0;
const memfs_1 = require("memfs");
const webpack_1 = require("webpack");
const path = __importStar(require("path"));
const buildSourceCode = () => __awaiter(void 0, void 0, void 0, function* () {
    const inputPath = "/index.js";
    const files = {
        "/index.js": `
        module.exports = function multiply(a, b) {
			return a*b;
		}`,
    };
    const memoryVolume = memfs_1.Volume.fromJSON(files);
    const memfs = (0, memfs_1.createFsFromVolume)(memoryVolume);
    // Define Rspack configuration
    const config = {
        mode: "production",
        entry: inputPath, // Entry should be the in-memory file path
        output: {
            path: "/dist", // Output directory in the in-memory filesystem
            filename: "bundle.js",
            library: {
                type: "commonjs2", // Export as CommonJS
            },
        },
        // Enable webpack-like configuration for memfs
        resolve: {
            extensions: [".js"],
        },
    };
    // Create and configure a Compiler instance
    const compiler = (0, webpack_1.webpack)(config);
    compiler.inputFileSystem = memfs;
    compiler.outputFileSystem = memfs;
    // Run the compiler
    compiler.run((err, stats) => {
        var _a, _b, _c;
        if (err) {
            console.error("Compilation error:", err);
            return;
        }
        if (stats === null || stats === void 0 ? void 0 : stats.hasErrors()) {
            console.error("Compilation errors:", stats.toJson().errors);
            return;
        }
        console.log("Compilation succeeded!");
        // Access the compiled output from the in-memory filesystem
        const outputPath = path.join(((_a = config.output) === null || _a === void 0 ? void 0 : _a.path) || "", ((_c = (_b = config.output) === null || _b === void 0 ? void 0 : _b.filename) === null || _c === void 0 ? void 0 : _c.toString()) || "");
        const compiledCode = memoryVolume.readFileSync(outputPath, "utf-8").toString();
        // Dynamically execute the compiled bundle
        const compiledFunction = new Function("module", "exports", "require", compiledCode);
        const module = { exports: {} };
        compiledFunction(module, module.exports, require);
        // Test the compiled function
        const multiply = module.exports;
        console.log("Result of multiply(4, 5):", multiply(4, 5));
    });
    // Close the compiler after the process
    compiler.close(() => {
        console.log("Compiler closed.");
    });
    return files;
});
exports.buildSourceCode = buildSourceCode;
(0, exports.buildSourceCode)();
