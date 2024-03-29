import prisma from "@/app/libs/prismadb";
export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locatioValue?: string;
  category?: string;
}

export default async function getListing(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locatioValue,
      category,
      guestCount,
    } = params;

    let query: any = {};
    if (userId) {
      query.userId = userId;
    }
    if (category) {
      query.category = category;
    }
    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }
    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }
    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (locatioValue) {
      query.locatioValue = locatioValue;
    }
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: {
                  gte: startDate,
                },
                startDate: {
                  lte: startDate,
                },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeListings = listings.map((listings) => ({
      ...listings,
      createdAt: listings.createdAt.toISOString(),
    }));
    return safeListings;
  } catch (error: any) {
    throw new Error(error);
  }
}
