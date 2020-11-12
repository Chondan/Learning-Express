# Salted Password Hasing 

## Related Stuffs
- session, session fixation, session hijacking
- cookie
- OWASP
- express-session
- cookie-parsing

## Lesson learned
- `module.parent` -> You can use `module.parent` to determine if the current script is loaded by another script.

For Example:

in 'a.js'
```JavaScript
if(!module.parent) {
	console.log("I am parent"); // if this module is used in another moduel, this line of code would not be executed.
} else {
	console.log("I am child");
}
```

In 'b.js'
```JavaScript
require('./a.js');
```

> run 'a.js' -> get 'I am parent', run 'b.js' -> 'I am child'

---

## Introduction


If you're a web developer, you've probably had to make a user accout system. The most important aspect of a user account system is how user passwords are protected. User account databases are hacked frequently, so you absolutely must do something to protect your user's passwords if your webstite is ever breached. The best way to protect password is to employ **salted password hashing**. This page will explain why it's done the way it is.

There are a lot of conflicting ideas and misconceptions on how to do password hashing properly, probably due to the abundance of misinformation on the web. Password hashing is one of those things that's so simple, but yet so many people get wrong. With this page, I hope to explain not only the correct way to do it, but why it should be done that way.

> **IMPORTANT WARNING:** If you are thinking of writing your own password hashing code, **please don't!**. It's too easy to screw up. No, that crytography course you took in university doesn't make you exempt from this warning. This applies to everyone: **DO NOT WRITE YOUR OWN CRYPTO!** The problem of storing passwords has already been solved. Use either use either *phppass*, the PHP, C#, Java, and Ruby implementations in *defuse/password-hashing*, or *libsodium.*

This guide is **not** meant to walk you through the process of writing your own storage system, it's to explain the reasons why passwords should be stored a certain way.

SECTINOS OF THIS PAGE
1. What is password hasing?
2. How Hashes are Cracked?
3. Adding Salt
4. Ineffective Hashing Methods
5. How to hash properly
6. Frequently Asked Question

---

## What is password hasing?
Hash algorithms are one way functions. They turn any amount of data into a fixed-length "fingerprint" that cannot be reversed. They also have the property that if the input changes by even a tiny bit, the resulting hash is completely different. This is great for protecting passwords, because we want to store passwords in a form that protects them even if the password file itself is compromised, but at the same time, we need to be able to verify that a user's password is correct.

The genereal workflow for account registration and authentication in a hash-based account system is as follows: 
1. The use create an account
2. Their password is hashed and stored in the database. At no point is the plain-text (unencrypted) password ever written to the hard drive.
3. When the user attemps to login, the hash of the password they entered is checked against the hash of their real password (retrieved from the database).
4. If the hashes match, the user is granted access. If not, the user is told they entered invalid login credentials.
5. Steps 3 and 4 repeat every time someone tries to login to their account.

In step 4, **never tell the user if it was the username or password they got wrong**. Always display a generic message like "Invalid username or password". This prevents attackers from enumerating valid usernames without knowing their passwords.

It should be note that the hash functions used to protect passwords are not the same as the hash functions you may have seen in a data structures course. The hash functions used to implement data structures such as hash tables are designed to be fast, not secure. Only **cryptographic hash functions** may be used to implement password hashing. Hash function like *SHA256, SHA512, RipeMD, and WHIRLPOOL* are crytographic hash functions.

It is easy to think that all you have to do is run the password through a cryptographic hash function and your user's passwords will be secure. This is far from the truth. There are many ways to recover passwords from plain hashes very quickly. There are several easy-to-implement techniques that make these "attacks" much less effective. To motivate the need for these techniques, consider this very website. On the front page, you can submit a list of hashes to be cracked, and receive results in less than a second. Clearly, simply hashing the password does not meet our needs for security.

The next section will be discuss some of the common attacks used to crack plain password hashes.

---

## How Hashes are Cracked

### Dictionary and Brute Force Attacks
This simplest way to crack a hash is to try to guess the password, hashing each guess, and checking if the guess'hash equals the hash being cracked. If the hashes are equal, the guess is the password. The two most common ways of guessing passwords are **dictionary attacks** and **brute-force-attacks.**

A dictionary attack uses a file containing words, phrases, common passwords, and other strings that are likely to be used as a password. Each word in the file is hashed, and its hash is compared to the password hash. If they match, that word is the password. These dictionary files are constructed by extracting words from large bodies of text, and even from real databases of passwords. Further processing is often applied to dictionary files, such as replacing words with their 'leet speak' equivalents ('hello' become 'h3110'), to make them more effective.

> lett speak: An information language or code used on the internet, in which standard letters are often replaced by numerals or special characters that resemble the letters in appearance.

A brute-force attack tries every possible combination of characters up to a given length. These attacks are very computationally expensive, and are usually the least efficient in terms of hashes cracked per processor time, but they will always eventually find the password. Passwords shoule be long enough that searching through all possible character strings to find it will take too long to be worthwhile.

There is no way to prevent dictionary attacks or brute force attacks. They can be made less effective, but there isn't a way to prevent them altogether. If your password hashing system is secure, the only way to crack the hashes will be to run a dictionary or brute-force attack on each hash.

### Lookup Tables
Lookup tables are an extremely effective method for cracking many hashes of the same type very quickly. The general idea is to **pre-compute** the hashes of the passwords in a password dictionary and store them, and their corresponding password, in a lookup talbe data structure. A good implementation of a lookup table can process hundreds of hash lookups per second, even when they contain many billions of hashes.

### Reverse Lookup Tables
This attack allows an attacker to apply a dictionary or brute-force attack to many hashes at the same time, without having to pre-compute a lookup table. 

First, the attacker creates a lookup table that maps each password hash from the compromised user account database to a list users who had that hash. The attacker then hashes each password guess and uses the lookup table to get a list of users whose password was the attacker's guess. This attack is especially effective because it is common for many users to have the same password. 

### Rainbow Tables
Rainbow tables are a time-memory trade-off technique. They are like lookup talbes, except that they sacrifice hash cracking speed to make the lookup tables smaller. Because they are smaller, the solutions to more hashes can be stored in the same amount of space, making them more effective. Rainbow tables that can crack any md5 hash of a password up to 8 chracters long exist.

Next, we'll look at a technique called salting, which makes it impossible to use lookup tables and rainbow tables to crack a hahs.

---

## Adding Salt
Lookup tables and rainbow tables only work because each password is hashed the exact same way. If two users have the same password, they'll have the same password hashes. We can prevent these attacks by randomizing each hash, so that when the same password is hashed twice, the hashes are not the same.

We can randomize the hashes by appending or prepending a random string, called a **salt**, to the password before hashing. As shown in the example above, this makes the same password hash into a comletely different string every time. To check if a password is correct, we need the salt, so it is usually stored in the user account database along with the hash, or as part of the hash string itself.

The salt does not need to be secret. Just by randomizing the hashes, lookup tables, reverse lookup tables, and rainbow tables become ineffective. An attacker won't know in advance what the salt will be, so they can't pre-compute a lookup table or rainbow table. If each user's password is hashed with a different salt, the reverse lookup table won't work either.

In the next section, we'll look at how salt is commonly implemented incorrectly.

---

## Ineffective Hashing Methods

### The **WRONG** Way: Short Salt & Salt Reuse
The most common salt implementation errors are reusing the same salt in multiple hashes, or using a salt that is too short.

#### Salt Reuse
A common mistake is to use the same salt in each hash. Either the salt is hard-coded into the program, or is generated randomly once. This is ineffective because if two users have the same password, they'll still have the same hash. An attacker can still use a reverse lookup table attack to run a dictionary attack on every hash at the same time. They just have to apply the salt to each password guess before they hash it. If the salt is hard-coded into a popular product, lookup talbes and rainbow tables can be built for that salt, to make it easier to crack hashes generated by the product.

> **Hard Coding** is a well-know antipattern against which most web development books warns us right in the preface. Hard coding is the unfortunate practice in which **we store configuration or input data**, such as a file path or a remote host name, **in the source code** rather than obtaining it from a configuration file, a database, a user input, or another external source.

A new random salt must be generated each time a user creates an account or changes their password.

#### Short Salt
If the salt is too short, an attacker can build a lookup table for every possible salt. For example, if the salt is only three ASCII characters, there are only 95 x 95 x 95 = 857,375 possible salts. That may seem like a lot, but if each lookup table contains only 1MB of the most common passwords, collectively they will be only 837GB, which is not a lot considering 1000GB hard drives can be bought for under $100 today.

For the same reason, the username shouldn't be used as a salt. Usernames may be unique to a single service, but they are predictable and often reused for accounts on other services. An attacker can build lookup tables for common usernames and use them to crack username-salted hashes.

To make it impossible for an attacker to create a lookup table for every possible salt, the salt must be long. A good rule of thumb is to use a salt that is the same size as the output of the hash function. For example, the output of SHA256 is 256 bits (32 bytes), so the salt should be at least 32 random bytes.

### The **WRONG** Way: Double Hashing & Wacky Hash Functions
This section covers another common password hashing misconception: wacky combinations of hash algorithms. It's easy to get carried away and try to combine different hash functions, hoping that the result will be more secure. In practice, though, there is very little benefit to doing it. All it does is create interoperability problems, and can sometims even make the hashes less secure. Never try to invent your own crypto, always use a standard that has been designed by experts. Some will argue that using multiple hash functions makes the process of computing the hash slower, so cracking is slower, but there's a better way to make the cracking process slower as we'll se later.

Here are some examples of poor wacky hash functions I've seen suggested in forums on the internet.
- md5(sha1(password))
- md5(md5(salt) + md5(password))

Do not use any of these.

That wacky functions are a good thing, because it's better if the attacker doesn't know which hash function is in use, it's less likely for an attacker to have pre-computed a rainbow table for the wacky hash function, and it takes longer to compute the hash function.

An attacker cannot attack a hash when he doesn't know the algorithm, but note *Kerckhoff's principle*, that the attacker will usually have access to the source code (specially if it's free or open source software), and that give a few password-hash pairs from the target system, it is not dificult to reverse engineer the algorithm. It does take longer to compute wacky functions, but only by a small constant factor. It's better to use an iterated algorithm that's design to be extremely hard to parallesize (these are discussed below). And, properly salting the hash solves the rainbow table problem.

 ---

