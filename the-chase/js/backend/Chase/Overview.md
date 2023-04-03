Requirements
---
1. Entailment
2. Projected dependencies
3. Lossless decomposition
4. Dependency preservation

Entailment
---
1. Problem: schema R, sigma that contains FDs and MVDs, is the FD or MVD provided implied by sigma on R?
2. Algorithm:
    1. Testing for join dependencies (which we can use for C |= X ->> Y, note C can only have FDs)
        1. Create a table with the columns of the relation
        2. For each relation scheme, create a row where
    2. Testing for functional dependecies (which we cna use for C |= X -> Y, note C can only have FDs)
3. Notes from resources
    1. David Maier's textbook
        1. Chapter on "Functional Dependencies" provides a useful algorithm that allows us to test for membership in O(n)
        2. Chapter on "The Chase" shows that we need to have two lemmas before using the chase to test for implication of functional dependencies.
            1. Lemma 8.4 
            2. Theorem 8.11 that C |= X -> A if and only if the chase has distinguished variables in the A-column
        3. Chapter on "The Chase" shows that the algorithms used in "Test for Join Dependencies" and "Test for Functional Dependencies" can only be used for C that only contain FDs
            1. Definition 8.16
        4. To prove "the chase can be used to test tableaux equivalence under C" use: Exercise 8.18 (need to do) and Lemma 3 (proof given)
        5. To prove "the resultant tableaux is equivalent to the original tableaux" use: Theorems 8.4 and 8.5
4. Good reference for paper: https://dbucsd.github.io/paperpdfs/2008_8.pdf
