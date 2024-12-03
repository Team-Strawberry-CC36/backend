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
var client_1 = require("@prisma/client");
var index_1 = require("./../utils/index");
var PlaceModel = /** @class */ (function () {
    function PlaceModel() {
    }
    /**
     * Method who performs the google Text Search and returns
     * an array of markers.
     * @param textQuery
     * @param category
     * @returns
     */
    PlaceModel.getMarkers = function (textQuery, category) {
        return __awaiter(this, void 0, void 0, function () {
            var markers, categoryMap, mappedCategory, queryResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        markers = [];
                        categoryMap = {
                            SHRINE: "shrine",
                            RESTAURANT: "restaurant",
                            ONSEN: "spa",
                        };
                        mappedCategory = categoryMap[category];
                        return [4 /*yield*/, index_1.googleClient.textSearch(textQuery, mappedCategory)];
                    case 1:
                        queryResults = _a.sent();
                        queryResults.forEach(function (place) {
                            var _a, _b;
                            if (!place.id ||
                                !((_a = place.location) === null || _a === void 0 ? void 0 : _a.latitude) ||
                                !((_b = place.location) === null || _b === void 0 ? void 0 : _b.longitude)) {
                                return;
                            }
                            // Brian's code
                            // const query = await googleClient.textSearch(textQuery, category);
                            // query.forEach((place) => {
                            //   // Don't do anything
                            //   if (!place.id || !place.location?.latitude || !place.location.longitude) {
                            //     return;
                            //   }
                            // Didin't change anything here by Ai
                            // Insert into markers response
                            markers.push({
                                id: place.id,
                                location: {
                                    lat: place.location.latitude,
                                    lon: place.location.longitude,
                                },
                            });
                        });
                        console.log(markers);
                        return [2 /*return*/, markers];
                }
            });
        });
    };
    /**
     * Method who receives a placeId and returns a IPlace object to the client.
     * @param placeId
     * @returns
     */
    // NOTE
    // This endpoint is hardcoded, it is working but it May have some errors
    PlaceModel.getPlaceById = function (placeId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, temp, existingPlace, placeCreated, rawEtiquettes, rawExperiences, etiquettes, experiences, placeFormatted, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, index_1.googleClient.searchPlaceDetails(placeId)];
                    case 1:
                        query = _d.sent();
                        if (!query) {
                            throw "Error! Query with not results";
                        }
                        console.log(query.displayName, query.formattedAddress);
                        if (!query.id ||
                            !((_a = query.displayName) === null || _a === void 0 ? void 0 : _a.text) ||
                            !query.formattedAddress ||
                            !((_b = query.location) === null || _b === void 0 ? void 0 : _b.latitude) ||
                            !((_c = query.location) === null || _c === void 0 ? void 0 : _c.longitude)) {
                            // This don't work!
                            return [2 /*return*/, null];
                        }
                        temp = void 0;
                        return [4 /*yield*/, index_1.prisma.places.findFirst({
                                where: { google_place_id: query.id },
                            })];
                    case 2:
                        existingPlace = _d.sent();
                        if (!!existingPlace) return [3 /*break*/, 4];
                        return [4 /*yield*/, index_1.prisma.places.createManyAndReturn({
                                data: {
                                    google_place_id: query.id,
                                    // NOTE [] This is default it
                                    place_type: client_1.PlaceType.ONSEN,
                                },
                            })];
                    case 3:
                        placeCreated = _d.sent();
                        if (placeCreated.length === 0) {
                            throw "Place created failed.";
                        }
                        else {
                            temp = placeCreated[0];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        temp = existingPlace;
                        _d.label = 5;
                    case 5: return [4 /*yield*/, index_1.prisma.place_etiquettes.findMany({
                            where: {
                                place_id: temp.id,
                            },
                            include: {
                                etiquette: true,
                            },
                        })];
                    case 6:
                        rawEtiquettes = _d.sent();
                        return [4 /*yield*/, index_1.prisma.experiences.findMany({
                                where: {
                                    place_id: temp.id,
                                },
                                include: {
                                    etiquettes: {
                                        include: {
                                            Place_etiquettes: {
                                                include: {
                                                    etiquette: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            })];
                    case 7:
                        rawExperiences = _d.sent();
                        etiquettes = rawEtiquettes.map(function (item) {
                            return {
                                id: item.id,
                                // NOTE [ ] Status needs to be dynamic
                                status: "allowed",
                                label: item.etiquette.label,
                            };
                        });
                        experiences = rawExperiences.map(function (item) {
                            return {
                                id: item.id,
                                username: item.user_id,
                                experience: item.experience,
                                dateVisited: item.visited_at,
                                etiquettes: item.etiquettes.map(function (e) {
                                    return {
                                        id: e.Place_etiquettes.id,
                                        status: e.Place_etiquettes.status,
                                        label: e.Place_etiquettes.etiquette.label,
                                    };
                                }),
                                metadata: {
                                    createdAt: item.created_at,
                                    updatedAt: item.edited_at,
                                },
                            };
                        });
                        placeFormatted = {
                            id: temp.id,
                            name: query.displayName.text,
                            address: query.formattedAddress,
                            // NOTe  [ ] placeType needs to be dynamic
                            placeType: "onsen",
                            location: {
                                latitude: query.location.latitude,
                                longitude: query.location.longitude,
                            },
                            etiquettes: etiquettes,
                            experiences: experiences,
                            metadata: {
                                createdAt: temp.created_at,
                                updatedAt: temp.edited_at,
                            },
                        };
                        return [2 /*return*/, placeFormatted];
                    case 8:
                        error_1 = _d.sent();
                        console.error("Oops! Something happend in placeModel.processPlace");
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return PlaceModel;
}());
console.log(PlaceModel.getMarkers("onsen", client_1.PlaceType.ONSEN));
exports.default = PlaceModel;
