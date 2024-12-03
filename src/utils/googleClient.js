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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var places_1 = require("@googlemaps/places");
var google_auth_library_1 = require("google-auth-library");
var GoogleClient = /** @class */ (function () {
    function GoogleClient(apiKey) {
        // Validation in the constructor.
        if (typeof apiKey !== "string") {
            throw new Error("Google Api key must be a value");
        }
        this.apiKey = apiKey;
        // Create the client by using auth!;
        this.placesClient = new places_1.v1.PlacesClient({
            authClient: new google_auth_library_1.GoogleAuth().fromAPIKey(this.apiKey),
        });
    }
    /**
     * Method who returns the places id with
     * @param textQuery text search value
     * @param location bias if provied
     * @returns array of object with id and location
     */
    GoogleClient.prototype.textSearch = function (textQuery, type, // For category filtering
    location) {
        return __awaiter(this, void 0, void 0, function () {
            var FIELD, defaultLocation, centerLocation, query, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        FIELD = "places.id,places.location,places.types";
                        defaultLocation = { lat: 35.6764, lon: 139.65 };
                        centerLocation = location || defaultLocation;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.placesClient.searchText({
                                textQuery: textQuery,
                                locationBias: {
                                    circle: {
                                        center: {
                                            latitude: centerLocation.lat,
                                            longitude: centerLocation.lon,
                                        },
                                        radius: 1000,
                                    },
                                },
                                includedType: type,
                            }, {
                                otherArgs: {
                                    headers: {
                                        "X-Goog-FieldMask": FIELD,
                                    },
                                },
                            })];
                    case 2:
                        query = (_a = (_b.sent())[0]) === null || _a === void 0 ? void 0 : _a.places;
                        return [2 /*return*/, query || []];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        throw new Error("Failed text search");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GoogleClient.prototype.searchPlaceDetails = function (placeId) {
        return __awaiter(this, void 0, void 0, function () {
            var FIELD, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        FIELD = "*";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.placesClient.getPlace({
                                name: "places/".concat(placeId),
                            }, {
                                otherArgs: {
                                    headers: {
                                        "X-Goog-FieldMask": FIELD,
                                    },
                                },
                            })];
                    case 2: return [2 /*return*/, (_a.sent())[0]];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw "Error inside searchPlaceDetails.";
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GoogleClient.prototype.photoByPlace = function (placeId) {
        return __awaiter(this, void 0, void 0, function () {
            var localUrl, res, bytes, bufferNode, base64;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        localUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=".concat(placeId, "&key=").concat(this.apiKey);
                        return [4 /*yield*/, fetch(localUrl, {
                                method: "GET",
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            console.error("Error fetching the photo:", res.statusText);
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, res.arrayBuffer()];
                    case 2:
                        bytes = _a.sent();
                        bufferNode = Buffer.from(bytes);
                        base64 = bufferNode.toString("base64");
                        return [2 /*return*/, base64];
                }
            });
        });
    };
    return GoogleClient;
}());
exports.default = GoogleClient;
