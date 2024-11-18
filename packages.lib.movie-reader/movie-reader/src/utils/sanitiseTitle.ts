import { isNil } from 'lodash-es';
import { emptyTitle } from '../constants/emptyTitle';

export const sanitiseTitle = (title: string | null | undefined) => (isNil(title) || title === '' ? emptyTitle : title);
