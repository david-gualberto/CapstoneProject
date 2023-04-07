export interface Overview {
  award:Award,
    name:string,
    detailId: number,
    geo: string,
    geoId: number,
    isOwner: boolean,
    links: any[],
    location: any,
    contact: Contact,
    rating: Rating,
    tags: any,
    detailCard: any;
}

export interface Contact{
  address: string,
  email: string,
  phone: string,
  website: string,
}

export interface Rating {
  primaryRanking: any,
secondaryRanking: null,
primaryRating: number,
reviewCount: number,
ratingQuestions: any[]
}

export interface Award{

    icon: string,
    awardText:string,
    yearsText: string,
    isTravelersChoice: boolean
}


