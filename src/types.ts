/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Player {
  slotNo: number; // 1 to 25 representing the registered slot number
  name: string;
  phone?: string;
}

export interface MatchDetails {
  title: string;
  opponent: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
}
