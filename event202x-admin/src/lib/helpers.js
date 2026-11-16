import { collection, doc, getDocs, getDoc, query, where, limit, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function fetchAll(){
    const snapshot = await getDocs(collection(db, "EventSignUps"));

    if (snapshot.empty) {
        return [];
    }

    const signUps = snapshot.docs.map((doc)=> ({
        id: doc.id,
        ...doc.data(),
    }));

    return signUps;
}

export async function getSize(filter){
    const q = query(collection(db, "EventSignUps"), where("hasAttended", "==", filter));
    const snapshot = await getDocs(q);

    return snapshot.size;
}

export async function searchFor(input){
    const term = input.trim();
    if (!term) return [];

    const [idSnap, fieldSnap] = await Promise.all([
        // Search by email
        getDoc(doc(db, "EventSignUps", term)),

        // Search by Name
        getDocs(
            query(
                collection(db, "EventSignUps"),
                where("Name", ">=", term),
                where("Name", "<=", term + "\uf8ff"),
                limit(10)
            )
        ),
    ]);

    const result = fieldSnap.docs.map((d)=> ({id: d, ...d.data()}));

    // Add the ID match (at the top) if found and not already in the results
    if (idSnap.exists() && !result.some((u)=> u.id === idSnap.id)) {
        result.unshift({ id: idSnap.id, ...idSnap.data()});
    }

    return result;
}

export async function checkInFromQr(idInput){

    const regId = idInput.trim().toUpperCase();
    if (!/^EVE-[0-9]{3,}$/.test(regId)) throw new Error("Not a valid RegistrationID");

    const q = query(
        collection(db, "EventSignUps"),
        where("RegistrationID", "==", regId),
        limit(2)
    );

    const snap = await getDocs(q);

    if (snap.empty) throw new Error("No Sign-up found for " + regId);
    if (snap.size > 1) throw new Error("Duplicates Found in the Database");
    const data = snap.docs[0].data();

    return data;

}

export async function updateAttendance(updateParameter, registrant){
    const userRef = doc(db, "EventSignUps", registrant);

    try {
        const result = await updateDoc(userRef, {
            hasAttended: (updateParameter === true ? true : false)
        });

        return "success";
    } catch (error) {
        console.error("Error Updating Document", error);
        return error;
    }
}