alter table public.settings
  alter column story set default $story$
We make our peanut butter at home, using our machine to turn peanuts into a smooth, creamy spread. We keep the recipe simple and pure.

1. Start with peanuts. Peanuts are the only ingredient in our peanut butter.
2. Add them to the machine. We put the peanuts into our grinding machine.
3. Grind until creamy. The machine grinds the peanuts into the smooth, creamy texture we love.
4. Keep it pure. We do not add sugar, water, or anything else—just peanuts.
5. Pack into jars. We put the creamy peanut butter into jars, ready for you to enjoy.
$story$;

update public.settings
   set story = $story$
We make our peanut butter at home, using our machine to turn peanuts into a smooth, creamy spread. We keep the recipe simple and pure.

1. Start with peanuts. Peanuts are the only ingredient in our peanut butter.
2. Add them to the machine. We put the peanuts into our grinding machine.
3. Grind until creamy. The machine grinds the peanuts into the smooth, creamy texture we love.
4. Keep it pure. We do not add sugar, water, or anything else—just peanuts.
5. Pack into jars. We put the creamy peanut butter into jars, ready for you to enjoy.
$story$,
       updated_at = now()
 where id = 1;
