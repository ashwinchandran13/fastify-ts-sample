"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var typebox_1 = require("@sinclair/typebox");
var ajv_formats_1 = __importDefault(require("ajv-formats"));
var ajv_1 = __importDefault(require("ajv"));
// Validation
var ajv = ajv_formats_1.default(new ajv_1.default(), [
    'email',
]).addKeyword('kind')
    .addKeyword('modifier');
var server = fastify_1.default();
// Schemas
var User = typebox_1.Type.Object({
    name: typebox_1.Type.String(),
    mail: typebox_1.Type.Optional(typebox_1.Type.String({ format: "email" })),
});
server.get('/ping', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, 'pong\n'];
    });
}); });
// using interface
server.get('/auth', {
    preValidation: function (request, reply, done) {
        var _a = request.query, username = _a.username, password = _a.password;
        done(username !== 'admin' ? new Error('Must be admin') : undefined);
    }
}, function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var customHeader;
    return __generator(this, function (_a) {
        customHeader = request.headers['h-Custom'];
        return [2 /*return*/, "logged in"];
    });
}); });
// Using JSON schema
server.post("/items", {
    schema: {
        body: User,
        response: {
            200: User,
        },
    },
}, function (req, rep) {
    var user = req.body;
    console.log(user);
    // const { name, mail } = user;
    // let items: UserType[] = [];
    // const item = {
    //     name,
    //     mail
    // }
    // items = [...items, item];
    var isValid = ajv.validate(User, user);
    console.log(isValid);
    rep.status(200).send(user);
});
server.listen(8080, function (err, address) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Server listen at " + address);
});
