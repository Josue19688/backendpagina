import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('T01_articulo_editor')
export class Articulo {
    @PrimaryGeneratedColumn('uuid')
    id:string;
  
    @Column({ type: 'bigint' })
    time: number;

  
    @Column({ type: 'jsonb' }) // Almacena los bloques como JSON
    blocks: object[];
  
    @Column()
    version: string;

    @CreateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz',default: () => "CURRENT_TIMESTAMP(6)"  })
    updatedAt: Date;
}
