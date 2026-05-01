export const analytics = {
  logSearch: (params) => {
    console.log(JSON.stringify({ event: "search", data: params, timestamp: new Date().toISOString() }));
  },
  logRouteSelect: (route) => {
    console.log(JSON.stringify({ event: "click", data: route, timestamp: new Date().toISOString() }));
  },
  logProviderClick: ({ provider, route_id, price }) => {
    console.log(JSON.stringify({ event: "provider_click", data: { provider, route_id, price }, timestamp: new Date().toISOString() }));
  },
  logError: (error) => {
    console.error(JSON.stringify({ event: "error", data: { message: error.message }, timestamp: new Date().toISOString() }));
  }
};
