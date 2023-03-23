

export interface Restaurant {
averageRating: number,
awardInfo:any,
currentOpenStatusCategory: String,
currentOpenStatusText: String
detailedReview: any,
distanceTo: String,
establishmentTypeAndCuisineTags: String[],
hasMenu: boolean,
heroImgRawHeight: number,
heroImgRawWidth: number,
heroImgUrl: String
isDifferentGeo:boolean,
isLocalChefItem: boolean,
isPremium: boolean,
isStoryboardPublished:boolean,
locationId: number
menuUrl: String,
name: String,
offers: any[],
parentGeoName: String
priceTag: String,
restaurantsId: String
reviewSnippets: Review[],
squareImgRawLength: number,
squareImgUrl: String
userReviewCount: number
}

export interface Review {
  reviewText: String;
  reviewUrl: String;
}
