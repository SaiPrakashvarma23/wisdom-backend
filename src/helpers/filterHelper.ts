// filterHelper.ts
export const buildFilters = (queryParams: any, allowedFilters: string[]) => {
  let filters= [];

  if (queryParams.search_string) {
    const searchString = queryParams.search_string;
    filters.push(
      `(
        name ILIKE '%${searchString}%' OR
        email ILIKE '%${searchString}%' OR
        phone ILIKE '%${searchString}%'
      )`
    );
  }

  if (queryParams.company) {
    filters.push(`company ILIKE '%${queryParams.company}%'`);
  }

  allowedFilters.forEach((filter) => {
    if (queryParams[filter]) {
      filters.push(`${filter} = '${queryParams[filter]}'`);
    }
  });

  // Only add 'WHERE' if there are filters
  if (filters.length > 0) {
    return filters.join(' AND ');
  }

  return ''; // No filters, return an empty string
};
