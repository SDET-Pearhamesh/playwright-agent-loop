/**
 * Every page on the Selenium Playground landing page.
 * `name` is the link text on the landing page (what you pass to `setup()`), `path` is relative to
 * BASE_URL, and `heading` is the page's H1. Nested Frames has no H1, so only its URL is checked.
 */
export const PLAYGROUND_PAGES = [
  { name: 'Ajax Form Submit', path: 'ajax-form-submit-demo/', heading: 'Form Submit Demo' },
  { name: 'Auto Healing', path: 'auto-healing/', heading: 'Auto Healing' },
  {
    name: 'Bootstrap Alerts',
    path: 'bootstrap-alert-messages-demo/',
    heading: 'Bootstrap Alert Messages',
  },
  {
    name: 'Bootstrap Date Picker',
    path: 'bootstrap-date-picker-demo/',
    heading: 'Bootstrap Date Pickers Demo',
  },
  {
    name: 'Bootstrap List Box',
    path: 'bootstrap-dual-list-box-demo/',
    heading: 'Bootstrap Dual List Demo',
  },
  { name: 'Bootstrap Modals', path: 'bootstrap-modal-demo/', heading: 'Bootstrap Modal' },
  {
    name: 'Bootstrap Progress bar',
    path: 'bootstrap-download-progress-demo/',
    heading: 'Bootstrap Download Progress Demo',
  },
  { name: 'Broken Image', path: 'broken-image/', heading: 'Broken Images' },
  { name: 'Checkbox Demo', path: 'checkbox-demo/', heading: 'Checkbox Demo' },
  { name: 'Context Menu', path: 'context-menu/', heading: 'Context Menus' },
  { name: 'Data List Filter', path: 'data-list-filter-demo/', heading: 'Data List Filter' },
  { name: 'Download File Demo', path: 'download-file-demo/', heading: 'Download File Demo' },
  { name: 'Drag & Drop Sliders', path: 'drag-drop-range-sliders-demo/', heading: 'Slider Demo' },
  { name: 'Drag and Drop', path: 'drag-and-drop-demo/', heading: 'Drag and Drop Demo' },
  {
    name: 'Dynamic Data Loading',
    path: 'dynamic-data-loading-demo/',
    heading: 'Dynamic Data Loading',
  },
  { name: 'File Download', path: 'generate-file-to-download-demo/', heading: 'File Download Demo' },
  { name: 'Geolocation Testing', path: 'geolocation-testing/', heading: 'Geolocation Testing' },
  { name: 'Hover Demo', path: 'hover-demo/', heading: 'Mouse Hover' },
  { name: 'iFrame Demo', path: 'iframe-demo/', heading: 'Simple iframe' },
  { name: 'Input Form Submit', path: 'input-form-demo/', heading: 'Form Demo' },
  {
    name: 'Javascript Alerts',
    path: 'javascript-alert-box-demo/',
    heading: 'Javascript Alert Box Demo',
  },
  {
    name: 'JQuery Date Picker',
    path: 'jquery-date-picker-demo/',
    heading: 'JQuery Date Picker Demo',
  },
  {
    name: 'JQuery Download Progress bars',
    path: 'jquery-download-progress-bar-demo/',
    heading: 'Jquery Download Progress-Bar Demo',
  },
  { name: 'JQuery List Box', path: 'jquery-dual-list-box-demo/', heading: 'JQuery Dual List Box' },
  {
    name: 'JQuery Select dropdown',
    path: 'jquery-dropdown-search-demo/',
    heading: 'Jquery Dropdown Search Demo',
  },
  { name: 'Key Press', path: 'key-press/', heading: 'Key Press' },
  { name: 'Nested Frames', path: 'nested-frames/', heading: null },
  { name: 'Overlapped Element', path: 'overlapped-element/', heading: 'Overlapped Element' },
  {
    name: 'Progress Bar Modal',
    path: 'bootstrap-progress-bar-dialog-demo/',
    heading: 'Bootstrap Progress Bar Dialog Demo',
  },
  { name: 'Radio Buttons Demo', path: 'radiobutton-demo/', heading: 'Radio button Demo' },
  { name: 'Redirection', path: 'redirection/', heading: 'Redirection' },
  { name: 'Select Dropdown List', path: 'select-dropdown-demo/', heading: 'Dropdown Demo' },
  { name: 'Shadow DOM', path: 'shadow-dom/', heading: 'Shadow DOM' },
  { name: 'Simple Form Demo', path: 'simple-form-demo/', heading: 'Simple Form Demo' },
  { name: 'Status Codes', path: 'status-code/', heading: 'Status Codes' },
  {
    name: 'Table Data Download',
    path: 'table-data-download-demo/',
    heading: 'Table Data Download',
  },
  { name: 'Table Data Search', path: 'table-search-filter-demo/', heading: 'Table Search filter' },
  { name: 'Table Filter', path: 'table-records-filter-demo/', heading: 'Table Filter Demo' },
  { name: 'Table Pagination', path: 'table-pagination-demo/', heading: 'Table Pagination Demo' },
  {
    name: 'Table Sort & Search',
    path: 'table-sort-search-demo/',
    heading: 'Table Sorting And Searching',
  },
  { name: 'To-Do App', path: 'todo-app/', heading: 'To-Do App Demo' },
  { name: 'Upload File Demo', path: 'upload-file-demo/', heading: 'Upload File Demo' },
  { name: 'Virtual DOM', path: 'virtual-dom/', heading: 'Virtual DOM' },
  { name: 'Window Popup Modal', path: 'window-popup-modal-demo/', heading: 'Window popup Modal' },
] as const;

export type PlaygroundPageName = (typeof PLAYGROUND_PAGES)[number]['name'];
export type PlaygroundPageEntry = (typeof PLAYGROUND_PAGES)[number];

export const LANDING_PAGE_TITLE = 'Selenium Grid Online | Run Selenium Test On Cloud';

export function getPlaygroundPage(name: PlaygroundPageName): PlaygroundPageEntry {
  const entry = PLAYGROUND_PAGES.find((candidate) => candidate.name === name);
  if (!entry) throw new Error(`Unknown Playground page: ${name}`);
  return entry;
}
