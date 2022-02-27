import { writable } from 'svelte/store';

const curDate = writable(new Date());
export default curDate;
