import {User} from "./user.model";

export interface History {
  id?: number,
  columnName: string,
  oldValue: string,
  newValue: string,
  demonstrationOfOldValue: string,
  demonstrationOfNewValue: string,
  dateOfChanges: Date,
  changer: User,
  recordId: number
}
