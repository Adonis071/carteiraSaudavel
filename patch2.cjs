const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const regexReg = /\} else if \(mode === 'register'\) \{\s+const userCredential = await createUserWithEmailAndPassword\(auth, email, password\);\s+if \(name\) \{\s+await updateProfile\(userCredential\.user, \{ displayName: name \}\);\s+\}\s+\} else if \(mode === 'reset'\) \{/s;

const newReg = `} else if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          age,
          email,
          phone,
          createdAt: new Date().toISOString()
        });
      } else if (mode === 'reset') {`;

code = code.replace(regexReg, newReg);

const regexJsx = /\{mode === 'register' && \(\s+<div>\s+<label htmlFor="name"(.*?)\s+<\/div>\s+\)\}/s;

const newJsx = `{mode === 'register' && (
              <>
                <div>
                  <label htmlFor="name"$1
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Idade
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      required
                      min="1"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
                      placeholder="Sua idade"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Telefone (para recuperar senha)
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-zinc-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </>
            )}`;

code = code.replace(regexJsx, newJsx);

fs.writeFileSync('src/components/Auth.tsx', code);
console.log("Patched correctly");
