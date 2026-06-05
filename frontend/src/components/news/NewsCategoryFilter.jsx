import { TabFilter } from '../ui';

const CATEGORY_TABS = [
  { value: '', label: 'All' },
  { value: 'club-news', label: 'Club News' },
  { value: 'match-previews', label: 'Previews' },
  { value: 'match-reports', label: 'Reports' },
  { value: 'ticket-news', label: 'Tickets' },
  { value: 'training', label: 'Training' },
  { value: 'community', label: 'Community' },
];

const NewsCategoryFilter = ({ active, onChange }) => (
  <TabFilter tabs={CATEGORY_TABS} active={active} onChange={onChange} />
);

export default NewsCategoryFilter;
