// const data: {labels: string[], datasets: {label: string, data: number[], backgroundColor: string[], hoverOffset: number}[]}
/**
 * A class to make use of chartJS easier
 */
export interface ChartJSData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverOffset: number;}[];
}
