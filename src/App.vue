<script setup>

</script>
<template>
    <RouterView />
</template>
<style>
:root{
    --color-bg: #F7FAF7;
    --color-bg-secondary: #E8EDE9;
    --color-primary: #123D2A;
    --color-secondary: #2F6B4F;
    --color-accent: #A3C95B;
    --color-text: #17211B;
    --color-error: #B84C4C;

    --font-heading: 'Montserrat', sans-serif;
    --font-body: 'Open Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6{
    font-family: var(--font-heading);
    line-height: 1.2;
    margin: 0;
    color: var(--color-text);
    font-weight: 500;
}

h1{ font-size: 3rem; }
h2{ font-size: 2.25rem; }
h3{ font-size: 1.875rem; }
h4{ font-size: 1.5rem; }
h5{ font-size: 1.25rem; }
h6{ font-size: 1rem; }

body, p{
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.2;
    margin: 0;
    color: var(--color-text);
    overflow: auto;
}

body{
    padding: 0;
    margin: 0;
}

small{
    font-size: 0.875rem;
}

html{
    font-size: 14px;
    background: var(--color-bg);
}

/* buttons */

button{
    all: unset;
    background: var(--color-primary);
    color: var(--color-bg);
    font-size: 1rem;
    font-family: var(--font-heading);
    padding: 0.5rem 0.8rem;
    border-radius: 1rem;
    border: 0.1rem solid var(--color-primary);
    cursor: pointer;
    transition: all 100ms ease;
}

button:is(:hover, :focus){
    background: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary)
}

button:disabled{
    background: var(--color-bg-secondary);
    cursor: not-allowed;
    color: var(--color-secondary);
    border-color: var(--color-secondary)
}

button.secondary{
    background: var(--color-bg);
    color: var(--color-primary);
}

button.secondary:is(:hover, :focus){
    background: var(--color-primary);
    color: var(--color-bg)
}

button.no-bg{
    background: transparent;
    border-color: transparent;
}

button.no-bg:is(:hover, :focus){
    color: var(--color-secondary);
    border-color: transparent;
    background: transparent;
}

/* anchor */
a{
    color: var(--color-secondary);
    cursor: pointer;
    text-decoration: underline;
}

a:hover{
    color: var(--color-accent)
}

/* input/textarea */
:is(input, textarea){
    background: var(--color-bg);
    border-radius: 1rem;
    padding: 0.5rem 0.8rem;
    font-family: var(--font-heading);
    font-size: 1rem;
    border: 0.1rem solid var(--color-primary);
    color: var(--color-text);
}

:is(input, textarea):is(:focus){
    outline: none;
    border-color: var(--color-secondary);
}

:is(input, textarea):disabled{
    opacity: 0.5;
}

/* select */
select{
    all: unset;
    font-family: var(--font-heading);
    border-radius: 1rem;
    border: 0.1rem solid var(--color-text);
    color: var(--color-text);
    background: var(--color-bg);
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    width: 200px;
    cursor: pointer;
    
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
}

select:is(:hover, :focus){
    color: var(--color-secondary);
    border-color: var(--color-bg-primary);
}

select:disabled{
    opacity: 0.7;
    cursor: not-allowed;
}

/* radio */
input[type="radio"]{
    width: 1rem;
    height: 1rem;
    accent-color: var(--color-secondary);
}

label:has(input[type="radio"]){
    font-size: 1.2rem;
    font-weight: 500;
    font-family: var(--font-heading);
}

/* lists */
ul, ol{
    margin-top: 0;
    margin-bottom: 0;
}

li{
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
}

/* all */
:is(input, select).short{
    width: 100px;
}

:is(input, select).long{
    width: 350px;
}

:is(input, textarea, select).error{
    border-color: var(--color-error);
    outline: var(--color-error);
}

</style>