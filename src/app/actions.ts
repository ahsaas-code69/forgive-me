"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");

export interface ForgivenessState {
  isForgiven: boolean;
  forgivenAt: string | null;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function getForgivenessState(): Promise<ForgivenessState> {
  try {
    ensureDataDir();
    if (!fs.existsSync(STATE_FILE)) {
      return { isForgiven: false, forgivenAt: null };
    }
    const data = fs.readFileSync(STATE_FILE, "utf-8");
    return JSON.parse(data) as ForgivenessState;
  } catch (error) {
    console.error("Failed to read forgiveness state:", error);
    return { isForgiven: false, forgivenAt: null };
  }
}

export async function acceptForgiveness(): Promise<ForgivenessState> {
  try {
    ensureDataDir();
    const newState: ForgivenessState = {
      isForgiven: true,
      forgivenAt: new Date().toISOString(),
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(newState, null, 2), "utf-8");
    
    // Backend console alert
    console.log("\n==============================================");
    console.log("              💖 SHE SAID YES! 💖             ");
    console.log(`Timestamp: ${newState.forgivenAt}`);
    console.log("----------------------------------------------");
    console.log(`
       *   *     *   *
     *       * *       *
    *         *         *
     *                 *
       *             *
         *         *
           *     *
             * *
              *
    `);
    console.log("==============================================\n");

    // Revalidate the homepage to update layout and component state
    revalidatePath("/");
    
    return newState;
  } catch (error) {
    console.error("Failed to save forgiveness state:", error);
    throw new Error("Unable to accept forgiveness server-side.");
  }
}

export async function resetForgivenessState(): Promise<ForgivenessState> {
  try {
    ensureDataDir();
    const newState: ForgivenessState = {
      isForgiven: false,
      forgivenAt: null,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(newState, null, 2), "utf-8");
    
    revalidatePath("/");
    
    return newState;
  } catch (error) {
    console.error("Failed to reset forgiveness state:", error);
    throw new Error("Unable to reset forgiveness state.");
  }
}
