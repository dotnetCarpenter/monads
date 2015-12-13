-- import GHC.List
-- import Data.Char

-- k :: (Num a) => a -> [Char]
-- k a = show a + "a"

-- h :: (Num c) => b -> c
-- h b
  -- | not isNumber b = drop 1 h
  -- | isNumber b = c
  -- where
--     c = read b
-- unitM :: a -> Monad a
-- unitM
-- bindM :: Monad a -> (a -> Monad b) -> Monad b
-- bindM
-- type M      =

term0 = (App (Lam "x" (Add (Var "x") (Var "x")))
						 (Add (Con 10) (Con 11)))

type Name         = String

data Term         = Var Name
                  | Con Int
                  | Add Term Term
                  | Lam Name Term
                  | App Term Term

data Value        = Wrong
                  | Num Int
                  | Fun (Value -> M Value)

type Environment  = [(Name, Value)]

showval :: Value -> String
showval Wrong = "<wrong>"
showval (Num i) = show i
showval (Fun f) = "<function>"
