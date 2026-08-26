const fs = require('fs');
const file = 'src/context/AuthContext.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {`;

const replacement = `  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // Auto logout after 15 minutes of inactivity (900000 ms)
      inactivityTimer = setTimeout(() => {
        if (auth.currentUser) {
          signOut(auth);
        }
      }, 900000);
    };

    const handleActivity = () => {
      if (auth.currentUser) {
        resetTimer();
      }
    };

    // Listeners for activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resetTimer();
      } else {
        clearTimeout(inactivityTimer);
      }
`;

code = code.replace(target, replacement);

const target2 = `    return unsubscribe;
  }, []);`;

const replacement2 = `    return () => {
      unsubscribe();
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);`;

code = code.replace(target2, replacement2);

fs.writeFileSync(file, code);
console.log("Patched AuthContext.tsx");
