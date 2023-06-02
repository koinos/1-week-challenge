--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: question; Type: TABLE; Schema: public; Owner: postgres
--

INSERT INTO public.question VALUES (default, 'Ms. Marvel’s Kamala Khan lives in Jersey City, NJ.', true, NULL);
INSERT INTO public.question VALUES (default, 'James Watson, Francis Crick, Maurice Williams, and Rosalind Franklin worked together to write the ultimate chocolate chip cookie recipe.', false, 'This is fiction. They actually worked together to discover the double helix structure of DNA.');
INSERT INTO public.question VALUES (default, 'Chinese-American abstract expressionist painter Bernice Bing used the nickname Bingo.', true, NULL);
INSERT INTO public.question VALUES (default, 'The ‘flying V’ is popular among Canada Geese because V is their favorite letter.', false, 'Birds travel in this formation to help with communication and to keep track of all the birds in their flock. Flying in formation also reduces wind resistance. This makes it easier for birds to migrate long distances. Canada Geese take turns leading the ‘V’ to avoid burnout.');
INSERT INTO public.question VALUES (default, 'Billionaire Richard Branson once staged an elaborate prank in which he paid over 100 random employees', false, 'No word that this ever happened, however, Branson is quite the prankster. In 1989, he staged a fake UFO sighting that almost led to him getting arrested.');
INSERT INTO public.question VALUES ('174c4770-93c4-46ef-bb69-339aea56adde', 'If you Google “cat” and click the paw print button that appears in the sidebar', true, NULL);
INSERT INTO public.question VALUES (default, 'Geckos lick their eyeballs to moisten them because they lack eyelids.', true, NULL);
INSERT INTO public.question VALUES (default, 'A man once tried to sue Nintendo after a woman canceled all future dates upon hearing him recite the first 151 Pokemon in order.', false, 'If this ever happened');
INSERT INTO public.question VALUES (default, 'A snake milker is an official job title.', true, NULL);
INSERT INTO public.question VALUES (default, 'Halloween is one of the busiest days of the year for pizza orders.', true, NULL);

--
-- Name: game; Type: TABLE; Schema: public; Owner: postgres
--

INSERT INTO public.game VALUES ('d6b579da-96c6-4d13-b8a2-bad7c23d1711', (extract(epoch from now())) * 1000, true, '5000', NULL, NULL);
INSERT INTO public.game VALUES ('0d7e96ee-9ed1-4de7-8bee-27225e684d8d', (extract(epoch from now()) + (60 * 5)) * 1000, true, '5000', NULL, NULL);
INSERT INTO public.game VALUES ('44e3b0bb-a56f-405a-a768-dfb5aab5e57a', (extract(epoch from now()) + (60 * 15)) * 1000, true, '5000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 30)) * 1000, default, '5000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 40)) * 1000, default, '15000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 50)) * 1000, default, '20000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 60)) * 1000, default, '10000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 70)) * 1000, default, '15000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 80)) * 1000, default, '5000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 90)) * 1000, default, '4000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 100)) * 1000, default, '3000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 110)) * 1000, default, '2000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 120)) * 1000, default, '5000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 130)) * 1000, default, '1000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 140)) * 1000, default, '6000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 150)) * 1000, default, '5000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 160)) * 1000, default, '3000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 170)) * 1000, default, '2000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 180)) * 1000, default, '1000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 190)) * 1000, default, '15000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 200)) * 1000, default, '75000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 210)) * 1000, default, '10000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 220)) * 1000, default, '5000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 230)) * 1000, default, '1250', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 240)) * 1000, default, '1000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 250)) * 1000, default, '20000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 260)) * 1000, default, '15000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 270)) * 1000, default, '1000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 280)) * 1000, default, '500', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 290)) * 1000, default, '10000', NULL, NULL);
INSERT INTO public.game VALUES (default, (extract(epoch from now()) + (60 * 300)) * 1000, default, '15000', NULL, NULL);

--
-- Name: active_game; Type: TABLE; Schema: public; Owner: postgres
--

INSERT INTO public.active_game VALUES ('d6b579da-96c6-4d13-b8a2-bad7c23d1711', (extract(epoch from now())) * 1000, 1, (extract(epoch from now()) + 20) * 1000, 'If you Google “cat” and click the paw print button that appears in the sidebar', '174c4770-93c4-46ef-bb69-339aea56adde', NULL, NULL, 5, 5, 0, 0, '5000', NULL, default);
INSERT INTO public.active_game VALUES ('0d7e96ee-9ed1-4de7-8bee-27225e684d8d', (extract(epoch from now()) + (60 * 5)) * 1000, 0, (extract(epoch from now()) + (60 * 5)) * 1000, NULL, NULL, NULL, NULL, 3, 3, 0, 0, '5000', NULL, default);
INSERT INTO public.active_game VALUES ('44e3b0bb-a56f-405a-a768-dfb5aab5e57a', (extract(epoch from now()) + (60 * 15)) * 1000, 0, (extract(epoch from now()) + (60 * 15)) * 1000, NULL, NULL, NULL, NULL, 5, 5, 0, 0, '5000', NULL, default);

--
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

INSERT INTO public.player VALUES ('user1', 0, 0, default);
INSERT INTO public.player VALUES ('user2', 0, 0, default);
INSERT INTO public.player VALUES ('user3', 0, 0, default);
INSERT INTO public.player VALUES ('user4', 0, 0, default);
INSERT INTO public.player VALUES ('user5', 0, 0, default);

--
-- Name: player_game; Type: TABLE; Schema: public; Owner: postgres
--

INSERT INTO public.player_game VALUES (default, 'user1', 'd6b579da-96c6-4d13-b8a2-bad7c23d1711', 1, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user2', 'd6b579da-96c6-4d13-b8a2-bad7c23d1711', 1, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user3', 'd6b579da-96c6-4d13-b8a2-bad7c23d1711', 1, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user4', 'd6b579da-96c6-4d13-b8a2-bad7c23d1711', 1, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user5', 'd6b579da-96c6-4d13-b8a2-bad7c23d1711', 1, default, default, NULL);

INSERT INTO public.player_game VALUES (default, 'user1', '0d7e96ee-9ed1-4de7-8bee-27225e684d8d', default, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user3', '0d7e96ee-9ed1-4de7-8bee-27225e684d8d', default, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user5', '0d7e96ee-9ed1-4de7-8bee-27225e684d8d', default, default, default, NULL);

INSERT INTO public.player_game VALUES (default, 'user1', '44e3b0bb-a56f-405a-a768-dfb5aab5e57a', default, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user2', '44e3b0bb-a56f-405a-a768-dfb5aab5e57a', default, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user3', '44e3b0bb-a56f-405a-a768-dfb5aab5e57a', default, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user4', '44e3b0bb-a56f-405a-a768-dfb5aab5e57a', default, default, default, NULL);
INSERT INTO public.player_game VALUES (default, 'user5', '44e3b0bb-a56f-405a-a768-dfb5aab5e57a', default, default, default, NULL);

--
-- Name: game_question; Type: TABLE; Schema: public; Owner: postgres
--

INSERT INTO public.game_question VALUES (default, 'd6b579da-96c6-4d13-b8a2-bad7c23d1711', '174c4770-93c4-46ef-bb69-339aea56adde', 1, 5, default, default);
