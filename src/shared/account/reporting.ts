export const reportDefinitions = {
  traffic: {
    title: `Website Traffic`,
    tabs: [`Overview`, `Daily`, `Countries`, `Sources`, `Pages`, `Devices`],
    metrics: [`Visitors`, `Page views`, `Bounce rate`],
  },
  runtime: {
    title: `Runtime Health`,
    tabs: [`Compute`, `Memory`, `Requests`, `Latency`, `Routes`, `Statuses`, `Cache`],
    metrics: [`Requests`, `Invocations`, `Active CPU time`, `5xx errors`],
  },
} as const;
export type ReportKey = keyof typeof reportDefinitions;
export const reportingMessage = `No server-authorized reporting source is connected. Values, filters, exports, and charts are unavailable; this preview sends no analytics events.`;
