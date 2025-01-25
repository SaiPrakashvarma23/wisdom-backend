// sortHelper.ts

export const dynamicSort = (sortBy: string = 'created_at', sortType: string = 'desc'): string => {
  // Default sorting is by 'created_at' in descending order
  let sortString = 'created_at desc';

  // If `sortBy` and `sortType` are provided, construct the sort string
  if (sortBy && sortType) {
    // Ensure only allowed fields are used for sorting to prevent SQL injection
    const allowedFields = ['created_at'];
    if (allowedFields.includes(sortBy)) {
      // Check if sortType is valid (asc or desc), default to 'desc' if invalid
      if (sortType.toLowerCase() === 'asc' || sortType.toLowerCase() === 'desc') {
        sortString = `${sortBy} ${sortType.toLowerCase()}`;
      } else {
        sortString = `${sortBy} desc`;  // Default to descending if invalid type
      }
    } else {
      sortString = 'created_at desc'; // Default to 'created_at desc' if invalid field
    }
  }

  return sortString;
};
