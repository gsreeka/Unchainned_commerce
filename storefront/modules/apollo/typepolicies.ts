import { offsetLimitPagination } from '@apollo/client/utilities';

export const keyMappings: any = {
  ProductSearchResult: {
    fields: {
      products: offsetLimitPagination(),
    },
  },
  ProductTexts: {
    keyArgs: ['forceLocale'],
  },
  Price: {
    fields: {
      currencyCode: {
        read(currencyCode = 'USD') {
          return currencyCode || 'USD';
        },
      },
      amount: {
        read(amount = 0) {
          return amount || 0;
        },
      },
    },
  },
  Order: {
    fields: {
      itemsTotal: {
        read(total) {
          if (!total) {
            return {
              __typename: 'Price',
              currencyCode: 'USD',
              amount: 0
            };
          }
          return {
            __typename: 'Price',
            currencyCode: total.currencyCode || 'USD',
            amount: total.amount || 0
          };
        },
        merge(existing, incoming) {
          return incoming || {
            __typename: 'Price',
            currencyCode: 'USD',
            amount: 0
          };
        }
      },
      taxesTotal: {
        read(total) {
          if (!total) {
            return {
              __typename: 'Price',
              currencyCode: 'USD',
              amount: 0
            };
          }
          return {
            __typename: 'Price',
            currencyCode: total.currencyCode || 'USD',
            amount: total.amount || 0
          };
        },
        merge(existing, incoming) {
          return incoming || {
            __typename: 'Price',
            currencyCode: 'USD',
            amount: 0
          };
        }
      },
      deliveryTotal: {
        read(total) {
          if (!total) {
            return {
              __typename: 'Price',
              currencyCode: 'USD',
              amount: 0
            };
          }
          return {
            __typename: 'Price',
            currencyCode: total.currencyCode || 'USD',
            amount: total.amount || 0
          };
        },
        merge(existing, incoming) {
          return incoming || {
            __typename: 'Price',
            currencyCode: 'USD',
            amount: 0
          };
        }
      },
      grandTotal: {
        read(total) {
          if (!total) {
            return {
              __typename: 'Price',
              currencyCode: 'USD',
              amount: 0
            };
          }
          return {
            __typename: 'Price',
            currencyCode: total.currencyCode || 'USD',
            amount: total.amount || 0
          };
        },
        merge(existing, incoming) {
          return incoming || {
            __typename: 'Price',
            currencyCode: 'USD',
            amount: 0
          };
        }
      },
      items: {
        merge(existing = [], incoming) {
          return incoming || [];
        },
      },
    },
  },
  Cart: {
    fields: {
      items: {
        merge(existing = [], incoming = []) {
          return incoming || [];
        },
      },
      total: {
        read(total) {
          if (!total) {
            return {
              __typename: 'Price',
              currencyCode: 'USD',
              amount: 0
            };
          }
          return {
            __typename: 'Price',
            currencyCode: total.currencyCode || 'USD',
            amount: total.amount || 0
          };
        },
        merge(existing, incoming) {
          return incoming || {
            __typename: 'Price',
            currencyCode: 'USD',
            amount: 0
          };
        }
      },
    },
  },
};

export const keyFields: any = {
  keyFields: (result: any) => {
    if (result?._id && result?.__typename) {
      return `${result?.__typename}:${result?._id}`;
    }
    if (result?.id && result?.__typename) {
      return `${result.__typename}:${result.id}`;
    }
    return null;
  },
};

export default { ...keyMappings, ...keyFields };
